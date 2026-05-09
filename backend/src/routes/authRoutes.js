import { Router } from "express";
import { registerUser, loginUser, getMe, updateProfile, uploadAvatar, verifyOTP, resendOTP, googleAuthSuccess } from "../controllers/authController.js";
import passport from "passport";
import { protect } from "../middleware/authMiddleware.js";
import { registerValidator, loginValidator, verifyOTPValidator, resendOTPValidator } from "../validators/authValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

// Public routes
router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);
router.post("/verify-otp", verifyOTPValidator, validateRequest, verifyOTP);
router.post("/resend-otp", resendOTPValidator, validateRequest, resendOTP);

// Google OAuth routes
router.get("/google", (req, res, next) => {
  const role = req.query.role; // No default role here
  passport.authenticate("google", { scope: ["profile", "email"], state: role || "" })(req, res, next);
});
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const message = info?.message || "Google authentication failed";
      const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:5173";
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(message)}`);
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      googleAuthSuccess(req, res, next);
    });
  })(req, res, next);
});

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;
