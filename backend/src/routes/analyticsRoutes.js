import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getOverviewAnalytics,
  getBusinessAnalytics,
  getQueueAnalytics,
  getPeakHours,
  getCompletionRate,
} from "../controllers/analyticsController.js";

const router = express.Router();

// All analytics routes require authentication and admin/superadmin role
router.use(protect);
router.use(authorize("admin", "superadmin"));

// GET /api/analytics/overview
// Get overall platform analytics
// Query: startDate, endDate, businessId (optional)
router.get("/overview", getOverviewAnalytics);

// GET /api/analytics/business/:businessId
// Get analytics for specific business
// Params: businessId
// Query: startDate, endDate (optional)
router.get("/business/:businessId", getBusinessAnalytics);

// GET /api/analytics/queues
// Get analytics for all queues
// Query: businessId, startDate, endDate (optional)
router.get("/queues", getQueueAnalytics);

// GET /api/analytics/peak-hours
// Get peak hours data
// Query: businessId, startDate, endDate (optional)
router.get("/peak-hours", getPeakHours);

// GET /api/analytics/completion-rate
// Get completion rate analytics
// Query: businessId, startDate, endDate (optional)
router.get("/completion-rate", getCompletionRate);

export default router;
