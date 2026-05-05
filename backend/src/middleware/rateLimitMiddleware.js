/**
 * Rate Limiting Middleware
 * Protects against brute force attacks and abuse
 */

import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * Global rate limiter
 * Limits all requests to 100 per 15 minutes per IP
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Don't rate limit health check
    if (req.path === "/api/health") return true;
    return false;
  },
  keyGenerator: (req, res) => {
    // Use express-rate-limit helper for robust IP handling (IPv4/IPv6)
    return ipKeyGenerator(req);
  },
});

/**
 * Authentication rate limiter
 * Limits login/register attempts to 5 per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased for initial testing/deployment
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Rate limit by IP + email (if provided) for targeted protection
    const email = req.body.email || "";
    const ip = ipKeyGenerator(req);
    return `${ip}:${email}`;
  },
  skip: (req, res) => {
    // Bypass rate limit entirely in development mode (for automated testing)
    if (process.env.NODE_ENV === "development") return true;
    return false;
  },
});

/**
 * API rate limiter
 * Limits regular API calls to 60 per 10 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500, // Increased for initial testing/deployment
  message: {
    success: false,
    message: "Too many requests, please try again after 10 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return ipKeyGenerator(req);
  },
  skip: (req) => {
    // Bypass in development for automated testing
    if (process.env.NODE_ENV === "development") return true;
    return false;
  },
});

/**
 * Sensitive actions rate limiter
 * Limits sensitive actions (delete, transfer, exchange) to 10 per 10 minutes per IP
 * More restrictive to prevent malicious activity
 */
export const sensitiveActionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many sensitive operations, please try again after 10 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return req.user?._id?.toString() || ipKeyGenerator(req);
  },
  skip: (req) => {
    // Bypass in development for automated testing
    if (process.env.NODE_ENV === "development") return true;
    if (req.user?.role === "superadmin") return true;
    return false;
  },
});

/**
 * Create custom rate limiter
 * Allows creating rate limiters for specific use cases
 *
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum requests allowed in window
 * @param {string} message - Custom error message
 * @returns {Function} Rate limit middleware
 */
export const createLimiter = (windowMs, maxRequests, message) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      success: false,
      message: message || "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export default globalLimiter;
