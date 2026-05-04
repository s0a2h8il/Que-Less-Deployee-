import { Router } from "express";
import {
  createExchangeRequest,
  acceptExchangeRequest,
  rejectExchangeRequest,
  getMyRequests,
  getExchangeHistory
} from "../controllers/exchangeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { exchangeValidator } from "../validators/exchangeValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.use(protect);

router.post("/request", exchangeValidator, validateRequest, createExchangeRequest);
router.get("/my-requests", getMyRequests);
router.get("/history", getExchangeHistory);
router.put("/:id/accept", acceptExchangeRequest);
router.put("/:id/reject", rejectExchangeRequest);

export default router;
