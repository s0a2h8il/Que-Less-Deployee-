import { useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/**
 * Hook to handle real-time notification socket events
 */
export const useNotificationSocket = (onNewNotification, onUnreadCountUpdate) => {
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      // console.log("Connected to Notification Socket");
      socket.emit("joinUserRoom", user._id);
    });

    socket.on("notification:new", (notification) => {
      if (onNewNotification) onNewNotification(notification);
    });

    socket.on("notification:unreadCount", (data) => {
      if (onUnreadCountUpdate) onUnreadCountUpdate(data.unreadCount);
    });

    // Handle specific legacy events for backward compatibility if needed
    socket.on("exchangeRequestReceived", (data) => {
      console.log("Exchange request received via socket", data);
    });

    socket.on("error", (err) => {
      console.error("Notification Socket Error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token, onNewNotification, onUnreadCountUpdate]);
};
