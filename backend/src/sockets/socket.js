import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { setSocketInstance } from "../utils/socketManager.js";

/**
 * Initialize Socket.io server
 * @param {object} httpServer - Express HTTP server
 */
const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    },
  });

  setSocketInstance(io);

  // ─── Socket Authentication Middleware ─────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (err) {
      console.error("🚫 Socket Auth failed:", err.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ─── Connection Handler ───────────────────────────────────────────────────────
  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    console.log(`🔌 User connected: ${socket.user.name} (${userId}) | Socket ID: ${socket.id}`);

    // Join private user room for targeted notifications
    socket.join(`user:${userId}`);
    console.log(`🏠 User joined private room: user:${userId}`);

    // ─── Room Management ────────────────────────────────────────────────────────
    socket.on("joinQueueRoom", (queueId) => {
      if (!queueId) return;
      
      socket.join(`queue:${queueId}`);
      console.log(`👥 Socket ${socket.id} joined queue room: queue:${queueId}`);

      socket.emit("joinedQueueRoom", {
        success: true,
        queueId,
        message: "Joined queue room successfully",
      });
    });

    socket.on("leaveQueueRoom", (queueId) => {
      socket.leave(`queue:${queueId}`);
      console.log(`👋 Socket ${socket.id} left queue room: queue:${queueId}`);
    });

    // ─── Disconnect ─────────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default initSocket;
