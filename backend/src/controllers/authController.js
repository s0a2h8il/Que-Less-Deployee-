import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build safe user object (excludes password)
// ─────────────────────────────────────────────────────────────────────────────
const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone || "",
  bio: user.bio || "",
  createdAt: user.createdAt,
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper: HTML Email Template
// ─────────────────────────────────────────────────────────────────────────────
const getEmailTemplate = (otp, title = "Welcome to Queue-Less!") => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
    .header { background: #0B1320; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px; }
    .header span.highlight { color: #3AA0FF; }
    .header span.orange { color: #E07A5F; }
    .content { padding: 40px; text-align: center; color: #334155; }
    .content h2 { color: #0f172a; margin-top: 0; font-size: 24px; }
    .content p { font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .otp-box { background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 24px; margin: 32px 0; }
    .otp-code { font-size: 36px; font-weight: 800; color: #1d4ed8; letter-spacing: 8px; margin: 0; }
    .footer { background: #f8fafc; padding: 24px 40px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Queue<span class="orange">-Less</span></h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      <p>Please verify your email address to secure your account. Use the One-Time Password (OTP) below to continue:</p>
      <div class="otp-box">
        <p class="otp-code">${otp}</p>
      </div>
      <p style="color: #64748b; font-size: 14px;">This code will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Queue-Less. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });
  
  if (user) {
    if (user.isVerified) {
      throw new ApiError(409, "User with this email already exists");
    }
    // If not verified, we allow them to re-register and get a new OTP
    user.name = name;
    user.password = password; // Will be hashed by pre-save hook
    user.role = role === "superadmin" ? "user" : (role || "user");
  } else {
    const finalRole = role === "superadmin" ? "user" : (role || "user");
    user = new User({
      name,
      email,
      password,
      role: finalRole,
      isVerified: false,
    });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  
  user.otp = hashedOtp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send Email (Non-blocking to prevent 502 timeouts on Render)
  const message = getEmailTemplate(otp, "Welcome to Queue-Less!");
  
  sendEmail({
    email: user.email,
    subject: "Account Verification OTP",
    message,
  }).catch(err => {
    console.error("Delayed Email Error:", err.message);
  });

  res.status(201).json(new ApiResponse(201, { user: safeUser(user) }, "Registration successful. Please check your email for the OTP to verify your account."));
});


// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) throw new ApiError(401, "Invalid email or password");

  if (!user.isVerified) {
    throw new ApiError(403, "Account not verified. Please verify your email using the OTP sent to you.");
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json(new ApiResponse(200, { user: safeUser(user), token }, "Login successful"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select("+otp");
  if (!user) throw new ApiError(404, "User not found");
  if (user.isVerified) throw new ApiError(400, "User is already verified");

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  
  if (user.otp !== hashedOtp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.otpExpiry < Date.now()) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = generateToken(user._id, user.role);
  res.status(200).json(new ApiResponse(200, { user: safeUser(user), token }, "Account verified successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");
  if (user.isVerified) throw new ApiError(400, "User is already verified");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  
  user.otp = hashedOtp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send Email (Non-blocking)
  const message = getEmailTemplate(otp, "Your Verification Code");

  sendEmail({
    email: user.email,
    subject: "New Account Verification OTP",
    message,
  }).catch(err => {
    console.error("❌ Background Resend Email Error:", err.message);
  });

  res.status(200).json(new ApiResponse(200, null, "A new OTP has been sent to your email."));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Google Auth Success handler
// @route   GET /api/auth/google/callback
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
export const googleAuthSuccess = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Google authentication failed");
  }

  const token = generateToken(req.user._id, req.user.role);
  const frontendUrl = process.env.CORS_ORIGIN || "http://localhost:5173";
  
  // Pass token as query parameter to frontend
  res.redirect(`${frontendUrl}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(safeUser(req.user)))}`);
});


// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const { name, email, avatar, phone, bio } = req.body;

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "Email already in use");
    user.email = email;
  }

  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;

  const updatedUser = await user.save();
  res.status(200).json(new ApiResponse(200, { user: safeUser(updatedUser) }, "Profile updated successfully"));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Upload profile avatar
// @route   POST /api/auth/avatar
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a file");
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  // Create public URL
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  
  user.avatar = avatarUrl;
  await user.save();

  res.status(200).json(new ApiResponse(200, { avatar: avatarUrl, user: safeUser(user) }, "Avatar uploaded successfully"));
});
