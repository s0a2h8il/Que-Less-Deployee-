import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Protect routes - Verify JWT token and attach user to request
// ─────────────────────────────────────────────────────────────────────────────
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Check if token exists
  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("🔓 Token verified for user:", decoded.id);

    // 4. Find user and attach to request (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User belonging to this token no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token, authorization denied");
    }

    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired, please login again");
    }

    throw new ApiError(401, "Not authorized, token failed");
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Authorize by role - Restrict access to specific roles
// @usage   authorize("admin", "superadmin")
// ─────────────────────────────────────────────────────────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authorized, please login first");
    }

    if (!roles.includes(req.user.role)) {
      // console.log(
      //   `⛔ Access denied for user ${req.user.email} with role "${req.user.role}". Required: [${roles.join(", ")}]`
      // );
      throw new ApiError(
        403,
        `Role "${req.user.role}" is not authorized to access this resource`
      );
    }

    // console.log(`✅ Role authorized: ${req.user.role}`);
    next();
  };
};
