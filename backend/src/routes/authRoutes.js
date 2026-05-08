import { Router } from "express";
import { registerUser, loginUser, getMe, updateProfile, uploadAvatar } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { registerValidator, loginValidator } from "../validators/authValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

// Public routes
router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;
