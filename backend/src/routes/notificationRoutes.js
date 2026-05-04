import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { apiLimiter, sensitiveActionLimiter } from "../middleware/rateLimitMiddleware.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = Router();

// All notification routes require authentication
router.use(protect);

router.get("/",             apiLimiter,             getNotifications);
router.get("/unread-count", apiLimiter,             getUnreadCount);
router.put("/read-all",     sensitiveActionLimiter, markAllAsRead);
router.put("/:id/read",     apiLimiter,             markAsRead);
router.delete("/:id",       sensitiveActionLimiter, deleteNotification);

export default router;
