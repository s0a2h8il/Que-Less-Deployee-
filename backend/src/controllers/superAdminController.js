import mongoose from "mongoose";
import User from "../models/User.js";
import Business from "../models/Business.js";
import Queue from "../models/Queue.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build pagination meta
// ─────────────────────────────────────────────────────────────────────────────
const paginate = (page, limit) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  return { pageNum, limitNum, skip: (pageNum - 1) * limitNum };
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: validate MongoDB ObjectId
// ─────────────────────────────────────────────────────────────────────────────
const validateId = (id, label = "ID") => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, `Invalid ${label}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const getPlatformStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalAdmins, totalBusinesses, verifiedBusinesses, activeQueues, totalQueues] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    Business.countDocuments(),
    Business.countDocuments({ isVerified: true }),
    Queue.countDocuments({ status: "active" }),
    Queue.countDocuments(),
  ]);

  res.status(200).json(new ApiResponse(200, {
    totalUsers,
    totalAdmins,
    totalBusinesses,
    verifiedBusinesses,
    unverifiedBusinesses: totalBusinesses - verifiedBusinesses,
    activeQueues,
    totalQueues,
    pendingReports: 0,
  }, "Platform stats fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 10 } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const filter = {};
  if (search) filter.$or = [
    { name: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
  ];
  if (role) filter.role = role;

  const [users, total] = await Promise.all([
    User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json(new ApiResponse(200, {
    users,
    pagination: { currentPage: pageNum, totalPages: Math.ceil(total / limitNum), totalResults: total, limit: limitNum },
  }, "Users fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all businesses with pagination and filters
// @route   GET /api/admin/businesses
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const getAllBusinesses = asyncHandler(async (req, res) => {
  const { search, isVerified, isActive, category, page = 1, limit = 10 } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const filter = {};
  if (search) filter.$or = [
    { name: { $regex: search, $options: "i" } },
    { category: { $regex: search, $options: "i" } },
    { city: { $regex: search, $options: "i" } },
  ];
  if (isVerified === "true" || isVerified === "false") filter.isVerified = isVerified === "true";
  if (isActive === "true" || isActive === "false") filter.isActive = isActive === "true";
  if (category) filter.category = category;

  const [businesses, total] = await Promise.all([
    Business.find(filter).populate("ownerId", "name email").sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Business.countDocuments(filter),
  ]);

  res.status(200).json(new ApiResponse(200, {
    businesses,
    pagination: { currentPage: pageNum, totalPages: Math.ceil(total / limitNum), totalResults: total, limit: limitNum },
  }, "Businesses fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify a business
// @route   PUT /api/admin/businesses/:id/verify
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const verifyBusiness = asyncHandler(async (req, res) => {
  validateId(req.params.id, "Business ID");
  const business = await Business.findById(req.params.id);
  if (!business) throw new ApiError(404, "Business not found");
  if (business.isVerified) throw new ApiError(400, "Business is already verified");

  business.isVerified = true;
  await business.save();

  res.status(200).json(new ApiResponse(200, { business }, "Business verified successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Unverify a business
// @route   PUT /api/admin/businesses/:id/unverify
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const unverifyBusiness = asyncHandler(async (req, res) => {
  validateId(req.params.id, "Business ID");
  const business = await Business.findById(req.params.id);
  if (!business) throw new ApiError(404, "Business not found");
  if (!business.isVerified) throw new ApiError(400, "Business is already unverified");

  business.isVerified = false;
  await business.save();

  res.status(200).json(new ApiResponse(200, { business }, "Business unverified successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a business (soft or hard)
// @route   DELETE /api/admin/businesses/:id
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const deleteBusiness = asyncHandler(async (req, res) => {
  validateId(req.params.id, "Business ID");
  const business = await Business.findById(req.params.id);
  if (!business) throw new ApiError(404, "Business not found");

  if (req.body.permanent === true) {
    await Business.findByIdAndDelete(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Business permanently deleted"));
  }

  business.isActive = false;
  await business.save();
  res.status(200).json(new ApiResponse(200, { business }, "Business deactivated successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all queues with pagination and filters
// @route   GET /api/admin/queues
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const getAllQueues = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const { pageNum, limitNum, skip } = paginate(page, limit);

  const filter = {};
  if (search) filter.$or = [{ title: { $regex: search, $options: "i" } }];
  if (status) filter.status = status;

  const [queues, total] = await Promise.all([
    Queue.find(filter).populate("businessId", "name category").sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Queue.countDocuments(filter),
  ]);

  const queuesWithStats = queues.map((queue) => ({
    ...queue,
    stats: {
      waitingCount: queue.members?.filter((m) => m.status === "waiting").length || 0,
      completedCount: queue.members?.filter((m) => m.status === "completed").length || 0,
      totalMembers: queue.members?.length || 0,
    },
  }));

  res.status(200).json(new ApiResponse(200, {
    queues: queuesWithStats,
    pagination: { currentPage: pageNum, totalPages: Math.ceil(total / limitNum), totalResults: total, limit: limitNum },
  }, "Queues fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a queue (soft or hard)
// @route   DELETE /api/admin/queues/:id
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const deleteQueue = asyncHandler(async (req, res) => {
  validateId(req.params.id, "Queue ID");
  const queue = await Queue.findById(req.params.id);
  if (!queue) throw new ApiError(404, "Queue not found");

  if (req.body.permanent === true) {
    await Queue.findByIdAndDelete(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Queue permanently deleted"));
  }

  queue.status = "closed";
  queue.closedAt = new Date();
  await queue.save();
  res.status(200).json(new ApiResponse(200, { queue }, "Queue closed successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get activity logs (audit trail placeholder)
// @route   GET /api/admin/logs
// @access  Private/SuperAdmin
// ─────────────────────────────────────────────────────────────────────────────
export const getActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { pageNum, limitNum } = paginate(page, limit);

  // TODO: implement with a proper ActivityLog model
  res.status(200).json(new ApiResponse(200, {
    logs: [],
    pagination: { currentPage: pageNum, limit: limitNum },
  }, "Activity logs fetched successfully"));
});
