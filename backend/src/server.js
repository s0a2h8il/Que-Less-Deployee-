import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import connectDB from "./config/db.js";
import initSocket from "./sockets/socket.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFoundMiddleware.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { globalLimiter, authLimiter, apiLimiter, sensitiveActionLimiter } from "./middleware/rateLimitMiddleware.js";
import { applySecurityMiddleware, corsConfig } from "./middleware/securityMiddleware.js";

// Route imports
import authRoutes         from "./routes/authRoutes.js";
import businessRoutes     from "./routes/businessRoutes.js";
import queueRoutes        from "./routes/queueRoutes.js";
import exchangeRoutes     from "./routes/exchangeRoutes.js";
import superAdminRoutes   from "./routes/superAdminRoutes.js";
import analyticsRoutes    from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security middleware (order matters) ───────────────────────────────────────
app.use(helmet());
applySecurityMiddleware(app);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors(corsConfig));
app.use(globalLimiter);

// ── Body / cookie parsers ─────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ── Health check (no rate limit) ──────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.status(200).json(new ApiResponse(200, null, "QueueLess API is running"))
);

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",          authLimiter,           authRoutes);
app.use("/api/business",      apiLimiter,            businessRoutes);
app.use("/api/queues",        apiLimiter,            queueRoutes);
app.use("/api/exchanges",     sensitiveActionLimiter, exchangeRoutes);
app.use("/api/admin",         sensitiveActionLimiter, superAdminRoutes);
app.use("/api/analytics",     apiLimiter,            analyticsRoutes);
app.use("/api/notifications",  apiLimiter,            notificationRoutes);

// ── Serving Frontend (Production) ─────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
}

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Server startup ────────────────────────────────────────────────────────────
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`   Run: netstat -ano | findstr :${PORT}  →  taskkill /PID <PID> /F\n`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});

if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is not defined in environment variables!");
  process.exit(1);
}

connectDB()
  .then(() => httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)))
  .catch((err) => { 
    console.error("❌ MongoDB connection failed:", err.message); 
    process.exit(1); 
  });