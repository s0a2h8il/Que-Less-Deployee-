import { Router } from "express";
import {
  createBusiness,
  getAllBusinesses,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
} from "../controllers/businessController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { businessValidator } from "../validators/businessValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

// Public routes
router.get("/", getAllBusinesses);
router.get("/my", protect, authorize("admin", "superadmin"), getMyBusinesses);
router.get("/:id([0-9a-fA-F]{24})", getBusinessById);

// Protected routes
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  businessValidator,
  validateRequest,
  createBusiness,
);
router.put(
  "/:id([0-9a-fA-F]{24})",
  protect,
  businessValidator,
  validateRequest,
  updateBusiness,
);

export default router;
