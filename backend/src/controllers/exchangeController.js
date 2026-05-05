import mongoose from "mongoose";
import ExchangeRequest from "../models/ExchangeRequest.js";
import Queue from "../models/Queue.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
  getSocketInstance,
  emitQueueUpdated,
  emitExchangeRequest,
  emitExchangeAccepted,
  emitExchangeRejected
} from "../utils/socketManager.js";
import { notificationService } from "../utils/notificationService.js";

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create exchange request
// @route   POST /api/exchanges/request
// ─────────────────────────────────────────────────────────────────────────────
export const createExchangeRequest = asyncHandler(async (req, res) => {
  const { queueId, toUser, message } = req.body;
  const fromUser = req.user._id;

  if (fromUser.toString() === toUser.toString()) {
    throw new ApiError(400, "You cannot exchange spots with yourself");
  }

  // 1. Find the queue and both members
  const queue = await Queue.findById(queueId);
  if (!queue) throw new ApiError(404, "Queue not found");
  if (queue.status !== "active") throw new ApiError(400, "Queue is not active");

  const fromMember = queue.members.find(m => m.userId.toString() === fromUser.toString() && m.status === "waiting");
  const toMember = queue.members.find(m => m.userId.toString() === toUser.toString() && m.status === "waiting");

  if (!fromMember) throw new ApiError(400, "You must be in the 'waiting' status in this queue");
  if (!toMember) throw new ApiError(400, "The target user is not 'waiting' in this queue");

  // 2. Check for existing pending request to this user
  const existingRequest = await ExchangeRequest.findOne({
    queueId,
    fromUser,
    toUser,
    status: "pending"
  });
  if (existingRequest) throw new ApiError(400, "You already have a pending request to this user");

  // 3. Create the request
  const request = await ExchangeRequest.create({
    queueId,
    fromUser,
    toUser,
    fromMemberId: fromMember._id,
    toMemberId: toMember._id,
    fromTokenNumber: fromMember.tokenNumber,
    toTokenNumber: toMember.tokenNumber,
    message,
    status: "pending"
  });

  // 4. Socket notification
  emitExchangeRequest(toUser, {
    requestId: request._id,
    fromUserName: req.user.name,
    fromToken: fromMember.tokenNumber,
    yourToken: toMember.tokenNumber,
    queueName: queue.title
  });

  // 🔔 Persist Notification
  notificationService.notifyExchangeRequest(
    toUser,
    req.user.name,
    request._id,
    queue._id,
    queue.title,
    fromMember.tokenNumber,
    toMember.tokenNumber
  ).catch(err => console.error("Notification Error:", err));

  res.status(201).json(new ApiResponse(201, request, "Exchange request sent successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Accept exchange request
// @route   PUT /api/exchanges/:id/accept
// ─────────────────────────────────────────────────────────────────────────────
export const acceptExchangeRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const request = await ExchangeRequest.findById(id);
  if (!request) throw new ApiError(404, "Request not found");
  if (request.toUser.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to accept this request");
  }
  if (request.status !== "pending") throw new ApiError(400, "Request is no longer pending");

  // 1. Find the queue
  const queue = await Queue.findById(request.queueId);
  if (!queue || queue.status !== "active") {
    request.status = "cancelled";
    await request.save();
    throw new ApiError(400, "Queue is no longer active");
  }

  // 2. Find both members and verify they are still 'waiting'
  const fromMember = queue.members.id(request.fromMemberId);
  const toMember = queue.members.id(request.toMemberId);

  if (!fromMember || fromMember.status !== "waiting" || !toMember || toMember.status !== "waiting") {
    request.status = "cancelled";
    await request.save();
    throw new ApiError(400, "One or both users are no longer waiting in the queue");
  }

  // 3. Swap token numbers
  const tempToken = fromMember.tokenNumber;
  fromMember.tokenNumber = toMember.tokenNumber;
  toMember.tokenNumber = tempToken;

  await queue.save();

  // 4. Update request status
  request.status = "accepted";
  request.acceptedAt = new Date();
  await request.save();

  // 5. Socket events & notifications
  const payload = { 
    requestId: request._id, 
    queueId: queue._id,
    fromUser: request.fromUser,
    toUser: request.toUser,
    newTokens: {
      [request.fromUser]: fromMember.tokenNumber,
      [request.toUser]: toMember.tokenNumber
    }
  };
  emitExchangeAccepted(request.fromUser, request.toUser, payload);
  
  // 🔔 Persist Notification
  notificationService.notifyExchangeAccepted(
    request.fromUser,
    req.user.name, // The person who accepted
    request._id,
    queue._id,
    queue.title,
    fromMember.tokenNumber // fromMember is the original requester, now has new token
  ).catch(err => console.error("Notification Error:", err));
  
  // Notify all in queue about update
  await emitQueueUpdated(queue, "Two users swapped their spots!");

  res.status(200).json(new ApiResponse(200, request, "Exchange request accepted. Spots swapped!"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Reject exchange request
// @route   PUT /api/exchanges/:id/reject
// ─────────────────────────────────────────────────────────────────────────────
export const rejectExchangeRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const request = await ExchangeRequest.findById(id);
  if (!request) throw new ApiError(404, "Request not found");
  if (request.toUser.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to reject this request");
  }
  if (request.status !== "pending") throw new ApiError(400, "Request is no longer pending");

  request.status = "rejected";
  request.rejectedAt = new Date();
  await request.save();

  // Fetch queue for notification (was missing — caused 500 error)
  const queue = await Queue.findById(request.queueId).select("title");

  // Socket notification
  emitExchangeRejected(request.fromUser, { 
    requestId: request._id,
    message: "Your exchange request was rejected"
  });

  // 🔔 Persist Notification
  if (queue) {
    notificationService.notifyExchangeRejected(
      request.fromUser,
      req.user.name,
      request._id,
      queue._id,
      queue.title
    ).catch(err => console.error("Notification Error:", err));
  }

  res.status(200).json(new ApiResponse(200, request, "Exchange request rejected"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get my requests (incoming and outgoing)
// @route   GET /api/exchanges/my-requests
// ─────────────────────────────────────────────────────────────────────────────
export const getMyRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [incoming, outgoing] = await Promise.all([
    ExchangeRequest.find({ toUser: userId, status: "pending" })
      .populate("fromUser", "name avatar")
      .populate("queueId", "title")
      .sort("-createdAt"),
    ExchangeRequest.find({ fromUser: userId, status: "pending" })
      .populate("toUser", "name avatar")
      .populate("queueId", "title")
      .sort("-createdAt")
  ]);

  res.status(200).json(new ApiResponse(200, { incoming, outgoing }, "Requests fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get exchange history
// @route   GET /api/exchanges/history
// ─────────────────────────────────────────────────────────────────────────────
export const getExchangeHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const history = await ExchangeRequest.find({
    $or: [{ fromUser: userId }, { toUser: userId }],
    status: { $ne: "pending" }
  })
    .populate("fromUser", "name avatar")
    .populate("toUser", "name avatar")
    .populate("queueId", "title")
    .sort("-updatedAt")
    .limit(50);

  res.status(200).json(new ApiResponse(200, history, "Exchange history fetched successfully"));
});
