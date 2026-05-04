import Notification from "../models/Notification.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get user notifications
// @route   GET /api/notifications
// ─────────────────────────────────────────────────────────────────────────────
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;
  const userId = req.user._id;

  const query = { userId };
  if (type) query.type = type;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("relatedQueue", "title")
      .populate("relatedExchange", "status"),
    Notification.countDocuments(query)
  ]);

  res.status(200).json(new ApiResponse(200, {
    notifications,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    }
  }, "Notifications fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// ─────────────────────────────────────────────────────────────────────────────
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ 
    userId: req.user._id, 
    isRead: false 
  });

  res.status(200).json(new ApiResponse(200, { count }, "Unread count fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// ─────────────────────────────────────────────────────────────────────────────
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// ─────────────────────────────────────────────────────────────────────────────
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  res.status(200).json(new ApiResponse(200, null, "All notifications marked as read"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// ─────────────────────────────────────────────────────────────────────────────
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndDelete({ 
    _id: id, 
    userId: req.user._id 
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Notification deleted"));
});
