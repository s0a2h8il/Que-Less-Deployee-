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
  startQueue,
  updateMemberStatus,
  getMyActiveQueues,
  getAdminQueues
} from "../controllers/queueController.js";
import { protect } from "../middleware/authMiddleware.js";
import { queueValidator, statusUpdateValidator } from "../validators/queueValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

// ── Specific protected routes first (must be before /:id) ──
router.get("/", protect, getAdminQueues);
router.get("/my-active", protect, getMyActiveQueues);
router.post("/", protect, queueValidator, validateRequest, createQueue);

// ── Public route ────────────────────────────────────────
// Anyone can view queue details (no login required)
router.get("/:id", getQueueDetails);

// ── Protected parameterized routes ──────────────────────
router.post("/:id/join", protect, joinQueue);
router.post("/:id/leave", protect, leaveQueue);

// Admin Control routes
router.post("/:id/next", protect, callNext);
router.put("/:id/pause", protect, pauseQueue);
router.put("/:id/resume", protect, resumeQueue);
router.put("/:id/close", protect, closeQueue);
router.put("/:id/start", protect, startQueue);
router.put("/:id/members/:memberId/status", protect, statusUpdateValidator, validateRequest, updateMemberStatus);

export default router;
