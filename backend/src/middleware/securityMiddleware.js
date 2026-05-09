/**
 * Security Middleware Configuration
 * Configures Helmet and other security settings
 */

import helmet from "helmet";

/**
 * Enhanced Helmet Configuration
 * Provides comprehensive security headers
 *
 * Features:
 * - Content Security Policy (CSP)
 * - X-Frame-Options (clickjacking protection)
 * - X-Content-Type-Options (MIME sniffing protection)
 * - X-XSS-Protection (XSS protection)
 * - Strict-Transport-Security (HTTPS enforcement)
 */
export const helmetConfig = helmet({
  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },

  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "https://que-less-deployee-backend.onrender.com",
        "wss://que-less-deployee-backend.onrender.com",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "ws://localhost:5000",
        "ws://127.0.0.1:5000",
      ],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },

  // Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: process.env.NODE_ENV === "production",
  },

  // Referrer Policy
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },

  // Disable x-powered-by header
  hidePoweredBy: true,
});

/**
 * CORS Configuration
 * Restricts cross-origin requests to allowed origins
 */
export const corsConfig = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    // Allow requests with no origin (same-site requests like mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === "development") {
      // In development, allow all origins
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 24 hours
};

/**
 * Cookie Configuration
 * Secure settings for authentication cookies
 */
export const cookieConfig = {
  httpOnly: true, // Prevents JavaScript access
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * JWT Configuration
 * Settings for JWT token handling
 */
export const jwtConfig = {
  tokenExpiry: process.env.JWT_EXPIRE || "7d",
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRE || "30d",
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
};

/**
 * Apply all security middleware
 *
 * @param {Object} app - Express application instance
 *
 * @example
 * import { applySecurityMiddleware } from "./middleware/securityMiddleware.js";
 * applySecurityMiddleware(app);
 */
export const applySecurityMiddleware = (app) => {
  // Apply Helmet
  app.use(helmetConfig);

  // Additional security headers
  app.use((req, res, next) => {
    // Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Enable XSS protection in older browsers
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    // Disable client-side caching for sensitive routes
    if (req.path.includes("/api/auth") || req.path.includes("/api/admin")) {
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }

    next();
  });
};

export default { helmetConfig, corsConfig, cookieConfig, jwtConfig };
