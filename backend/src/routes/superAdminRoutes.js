import { Router } from "express";
import {
  getPlatformStats,
  getAllUsers,
  getAllBusinesses,
  verifyBusiness,
  unverifyBusiness,
  deleteBusiness,
  getAllQueues,
  deleteQueue,
  getActivityLogs,
} from "../controllers/superAdminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// All super admin routes require authentication and superadmin role
router.use(protect, authorize("superadmin"));

// Stats route
router.get("/stats", getPlatformStats);

// User management
router.get("/users", getAllUsers);

// Business management
router.get("/businesses", getAllBusinesses);
router.put("/businesses/:id/verify", verifyBusiness);
router.put("/businesses/:id/unverify", unverifyBusiness);
router.delete("/businesses/:id", deleteBusiness);

// Queue management
router.get("/queues", getAllQueues);
router.delete("/queues/:id", deleteQueue);

// Activity logs
router.get("/logs", getActivityLogs);

export default router;
