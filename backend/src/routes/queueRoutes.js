import { Router } from "express";
import {
  createQueue,
  getQueueDetails,
  joinQueue,
  leaveQueue,
  callNext,
  pauseQueue,
  resumeQueue,
  closeQueue,
  updateMemberStatus,
  getMyActiveQueues,
  getAdminQueues
} from "../controllers/queueController.js";
import { protect } from "../middleware/authMiddleware.js";
import { queueValidator, statusUpdateValidator } from "../validators/queueValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

// All queue routes require authentication
router.use(protect);

// User & Shared routes
router.get("/", getAdminQueues);
router.get("/my-active", getMyActiveQueues);
router.post("/", queueValidator, validateRequest, createQueue);
router.get("/:id", getQueueDetails);
router.post("/:id/join", joinQueue);
router.post("/:id/leave", leaveQueue);

// Admin Control routes
router.post("/:id/next", callNext);
router.put("/:id/pause", pauseQueue);
router.put("/:id/resume", resumeQueue);
router.put("/:id/close", closeQueue);
router.put("/:id/members/:memberId/status", statusUpdateValidator, validateRequest, updateMemberStatus);

export default router;
