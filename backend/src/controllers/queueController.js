import mongoose from "mongoose";
import Queue from "../models/Queue.js";
import Business from "../models/Business.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitQueueUpdated, emitTurnNear, emitCalledNext } from "../utils/socketManager.js";
import { notificationService } from "../utils/notificationService.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Verify caller owns the queue's business (or is superadmin)
// ─────────────────────────────────────────────────────────────────────────────
const checkQueueOwnership = async (queueId, userId, userRole) => {
  const queue = await Queue.findById(queueId);
  if (!queue) return { error: new ApiError(404, "Queue not found") };

  const business = await Business.findById(queue.businessId);
  if (!business) return { error: new ApiError(404, "Business not found") };

  const isOwner = business.ownerId.toString() === userId.toString();
  if (!isOwner && userRole !== "superadmin")
    return { error: new ApiError(403, "You are not authorized to control this queue") };

  return { queue, business };
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Get IDs of members with active statuses
// ─────────────────────────────────────────────────────────────────────────────
const getActiveUserIds = (queue) =>
  queue.members
    .filter((m) => ["waiting", "called"].includes(m.status))
    .map((m) => m.userId);

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all queues managed by the admin
// @route   GET /api/queues
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminQueues = asyncHandler(async (req, res) => {
  const businesses = await Business.find({ ownerId: req.user._id });
  const businessIds = businesses.map((b) => b._id);

  const queues = await Queue.find({ businessId: { $in: businessIds } })
    .populate("businessId", "name category city")
    .populate("members.userId", "name avatar")
    .sort({ createdAt: -1 });

  const formattedQueues = queues.map((queue) => ({
    _id: queue._id,
    title: queue.title,
    status: queue.status,
    business: queue.businessId,
    stats: {
      waitingCount: queue.members.filter((m) => m.status === "waiting").length,
      completedCount: queue.members.filter((m) => m.status === "completed").length,
      totalJoined: queue.members.length,
      currentToken: queue.currentToken,
    },
  }));

  res.status(200).json(new ApiResponse(200, formattedQueues, "Admin queues fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new queue
// @route   POST /api/queues
// ─────────────────────────────────────────────────────────────────────────────
export const createQueue = asyncHandler(async (req, res) => {
  const { businessId, title, description, estimatedTimePerUser, maxUsers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(businessId))
    throw new ApiError(400, "Invalid Business ID");

  const business = await Business.findById(businessId);
  if (!business) throw new ApiError(404, "Business not found");

  const isOwner = business.ownerId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "superadmin")
    throw new ApiError(403, "You are not authorized to create a queue for this business");

  const queue = await Queue.create({
    businessId,
    createdBy: req.user._id,
    title,
    description,
    estimatedTimePerUser: estimatedTimePerUser || 5,
    maxUsers: maxUsers || 100,
  });

  res.status(201).json(new ApiResponse(201, { queue }, "Queue created successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get queue details
// @route   GET /api/queues/:id
// ─────────────────────────────────────────────────────────────────────────────
export const getQueueDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid Queue ID");

  const queue = await Queue.findById(id)
    .populate("businessId", "name address city ownerId")
    .populate("members.userId", "name avatar email");
  if (!queue) throw new ApiError(404, "Queue not found");

  // Safely check ownership — req.user may be undefined for public access
  const userId = req.user?._id;
  const isOwner = userId && queue.businessId?.ownerId?.toString() === userId.toString();
  const isSuperAdmin = req.user?.role === "superadmin";

  let currentUserMember = null;
  let position = null;
  let estimatedWaitTime = null;

  if (userId) {
    currentUserMember = queue.members.find(
      (m) => (m.userId._id || m.userId).toString() === userId.toString() && ["waiting", "called"].includes(m.status)
    );

    if (currentUserMember?.status === "waiting") {
      position = queue.members.filter(
        (m) => m.status === "waiting" && m.joinedAt < currentUserMember.joinedAt
      ).length + 1;
      estimatedWaitTime = position * queue.estimatedTimePerUser;
    }
  }

  const waitingCount = queue.members.filter((m) => m.status === "waiting").length;

  res.status(200).json(new ApiResponse(200, {
    queue: {
      _id: queue._id,
      title: queue.title,
      description: queue.description,
      status: queue.status,
      currentToken: queue.currentToken,
      estimatedTimePerUser: queue.estimatedTimePerUser,
      maxUsers: queue.maxUsers,
      business: queue.businessId,
      members: queue.members.map((m) => ({
        _id: m._id,
        userId: m.userId && typeof m.userId === 'object' ? {
          _id: m.userId._id,
          name: m.userId.name || "Guest User",
          avatar: m.userId.avatar,
          email: (isOwner || isSuperAdmin) ? m.userId.email : undefined,
        } : { _id: m.userId, name: "Guest User" },
        tokenNumber: m.tokenNumber,
        status: m.status,
        joinedAt: m.joinedAt,
        calledAt: m.calledAt,
      })),
    },
    stats: {
      totalWaitingUsers: waitingCount,
      completedCount: queue.members.filter((m) => m.status === "completed").length,
      totalJoined: queue.members.length,
    },
    userStatus: currentUserMember
      ? { isJoined: true, tokenNumber: currentUserMember.tokenNumber, status: currentUserMember.status, position, estimatedWaitTime, joinedAt: currentUserMember.joinedAt }
      : { isJoined: false },
  }, "Queue details fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Join a queue
// @route   POST /api/queues/:id/join
// ─────────────────────────────────────────────────────────────────────────────
export const joinQueue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const queue = await Queue.findById(id);
  if (!queue) throw new ApiError(404, "Queue not found");

  if (queue.status !== "active")
    throw new ApiError(400, `Queue is currently ${queue.status}. Cannot join.`);

  const isAlreadyIn = queue.members.some(
    (m) => m.userId.toString() === req.user._id.toString() && ["waiting", "called"].includes(m.status)
  );
  if (isAlreadyIn) throw new ApiError(400, "You are already in this queue");

  const waitingCount = queue.members.filter((m) => m.status === "waiting").length;
  if (waitingCount >= queue.maxUsers) throw new ApiError(400, "Queue is full");

  const tokenNumber = queue.nextTokenNumber;
  queue.members.push({ userId: req.user._id, tokenNumber, status: "waiting" });
  queue.nextTokenNumber += 1;
  await queue.save();

  await emitQueueUpdated(queue, `${req.user.name} joined the queue`);
  emitTurnNear(queue);

  res.status(200).json(new ApiResponse(200, { tokenNumber, position: waitingCount + 1 }, "Joined queue successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Leave a queue
// @route   POST /api/queues/:id/leave
// ─────────────────────────────────────────────────────────────────────────────
export const leaveQueue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const queue = await Queue.findById(id);
  if (!queue) throw new ApiError(404, "Queue not found");

  const memberIndex = queue.members.findIndex(
    (m) => m.userId.toString() === req.user._id.toString() && m.status === "waiting"
  );
  if (memberIndex === -1)
    throw new ApiError(400, "You are not an active member of this queue");

  queue.members[memberIndex].status = "left";
  queue.members[memberIndex].leftAt = new Date();
  await queue.save();

  await emitQueueUpdated(queue, "A member left the queue");
  emitTurnNear(queue);

  res.status(200).json(new ApiResponse(200, null, "You have left the queue"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Call next user in queue
// @route   POST /api/queues/:id/next
// ─────────────────────────────────────────────────────────────────────────────
export const callNext = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { queue, error } = await checkQueueOwnership(id, req.user._id, req.user.role);
  if (error) throw error;

  if (queue.status !== "active")
    throw new ApiError(400, "Queue must be active to call next user");

  // Complete currently called user
  const currentCalled = queue.members.find((m) => m.status === "called");
  if (currentCalled) {
    currentCalled.status = "completed";
    currentCalled.completedAt = new Date();
  }

  // Find next waiting user (lowest token number)
  const waitingMembers = queue.members
    .filter((m) => m.status === "waiting")
    .sort((a, b) => a.tokenNumber - b.tokenNumber);

  if (waitingMembers.length === 0) {
    await queue.save();
    await emitQueueUpdated(queue, "Queue is now empty");
    return res.status(200).json(new ApiResponse(200, { currentToken: queue.currentToken }, "No waiting users left"));
  }

  const nextUser = waitingMembers[0];
  nextUser.status = "called";
  nextUser.calledAt = new Date();
  queue.currentToken = nextUser.tokenNumber;
  await queue.save();

  emitCalledNext(id, nextUser);
  await emitQueueUpdated(queue, `Token #${nextUser.tokenNumber} is called`);
  emitTurnNear(queue);

  // Populate nextUser.userId for the response
  await queue.populate("members.userId", "name avatar email");
  const updatedNextUser = queue.members.find(m => m._id.toString() === nextUser._id.toString());

  res.status(200).json(new ApiResponse(200, {
    currentToken: queue.currentToken,
    calledUser: { 
      userId: updatedNextUser.userId, 
      tokenNumber: updatedNextUser.tokenNumber, 
      status: updatedNextUser.status 
    },
  }, "Next user called successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Pause queue
// @route   PUT /api/queues/:id/pause
// ─────────────────────────────────────────────────────────────────────────────
export const pauseQueue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { queue, error } = await checkQueueOwnership(id, req.user._id, req.user.role);
  if (error) throw error;

  if (queue.status === "closed") throw new ApiError(400, "Cannot pause a closed queue");
  if (queue.status === "paused") throw new ApiError(400, "Queue is already paused");

  queue.status = "paused";
  await queue.save();

  await emitQueueUpdated(queue, "Queue has been paused");
  notificationService.notifyQueueStatus(getActiveUserIds(queue), queue._id, queue.title, "paused");

  res.status(200).json(new ApiResponse(200, { status: queue.status }, "Queue paused successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Resume queue
// @route   PUT /api/queues/:id/resume
// ─────────────────────────────────────────────────────────────────────────────
export const resumeQueue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { queue, error } = await checkQueueOwnership(id, req.user._id, req.user.role);
  if (error) throw error;

  if (queue.status !== "paused") throw new ApiError(400, "Queue is not paused");

  queue.status = "active";
  await queue.save();

  await emitQueueUpdated(queue, "Queue is now active");
  notificationService.notifyQueueStatus(getActiveUserIds(queue), queue._id, queue.title, "resumed");

  res.status(200).json(new ApiResponse(200, { status: queue.status }, "Queue resumed successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Close queue
// @route   PUT /api/queues/:id/close
// ─────────────────────────────────────────────────────────────────────────────
export const closeQueue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { queue, error } = await checkQueueOwnership(id, req.user._id, req.user.role);
  if (error) throw error;

  if (queue.status === "closed") throw new ApiError(400, "Queue is already closed");

  // Capture active user IDs BEFORE cancelling them
  const affectedUserIds = getActiveUserIds(queue);

  queue.members.forEach((m) => {
    if (["waiting", "called"].includes(m.status)) {
      m.status = "cancelled";
      m.leftAt = new Date();
    }
  });

  queue.status = "closed";
  queue.closedAt = new Date();
  await queue.save();

  await emitQueueUpdated(queue, "Queue has been closed");
  notificationService.notifyQueueStatus(affectedUserIds, queue._id, queue.title, "closed");

  res.status(200).json(new ApiResponse(200, {
    status: queue.status,
    summary: {
      total: queue.members.length,
      completed: queue.members.filter((m) => m.status === "completed").length,
      cancelled: queue.members.filter((m) => m.status === "cancelled").length,
    },
  }, "Queue closed successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Start/Reopen a closed queue (reset for a new session)
// @route   PUT /api/queues/:id/start
// ─────────────────────────────────────────────────────────────────────────────
export const startQueue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { queue, error } = await checkQueueOwnership(id, req.user._id, req.user.role);
  if (error) throw error;

  // Reset logic for a fresh session
  queue.status = "active";
  queue.currentToken = 0;
  queue.nextTokenNumber = 1;
  queue.members = []; 
  queue.closedAt = undefined;

  await queue.save();
  await emitQueueUpdated(queue, "Queue has been started for a new session");

  res.status(200).json(new ApiResponse(200, queue, "Queue started successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a member's status manually
// @route   PUT /api/queues/:id/members/:memberId/status
// ─────────────────────────────────────────────────────────────────────────────
export const updateMemberStatus = asyncHandler(async (req, res) => {
  const { id, memberId } = req.params;
  const { status } = req.body;

  const ALLOWED = ["waiting", "called", "completed", "left", "skipped", "cancelled"];
  if (!ALLOWED.includes(status)) throw new ApiError(400, "Invalid status provided");

  const { queue, error } = await checkQueueOwnership(id, req.user._id, req.user.role);
  if (error) throw error;

  const member = queue.members.id(memberId);
  if (!member) throw new ApiError(404, "Member not found in this queue");

  const now = new Date();
  member.status = status;

  if (status === "called")         { member.calledAt = now;    queue.currentToken = member.tokenNumber; }
  else if (status === "completed") { member.completedAt = now; }
  else if (status === "left" || status === "cancelled") { member.leftAt = now; }
  else if (status === "skipped")   { member.skippedAt = now; }

  await queue.save();

  await emitQueueUpdated(queue, `Status updated for Token #${member.tokenNumber}`);
  emitTurnNear(queue);

  res.status(200).json(new ApiResponse(200, { member }, "Member status updated successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get user's currently active queues
// @route   GET /api/queues/my-active
// ─────────────────────────────────────────────────────────────────────────────
export const getMyActiveQueues = asyncHandler(async (req, res) => {
  const queues = await Queue.find({
    members: { $elemMatch: { userId: req.user._id, status: { $in: ["waiting", "called"] } } },
  }).populate("businessId", "name category city address");

  const formattedQueues = queues.map((queue) => {
    const member = queue.members.find(
      (m) => m.userId.toString() === req.user._id.toString() && ["waiting", "called"].includes(m.status)
    );
    const position = queue.members.filter(
      (m) => m.status === "waiting" && m.tokenNumber < member.tokenNumber
    ).length + 1;

    return {
      _id: queue._id,
      title: queue.title,
      status: queue.status,
      currentToken: queue.currentToken,
      estimatedTimePerUser: queue.estimatedTimePerUser,
      business: queue.businessId,
      userToken: member.tokenNumber,
      userStatus: member.status,
      position,
      estimatedWaitTime: position * queue.estimatedTimePerUser,
    };
  });

  res.status(200).json(new ApiResponse(200, formattedQueues, "Active queues fetched successfully"));
});
