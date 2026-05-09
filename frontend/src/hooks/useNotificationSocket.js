import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/**
 * Hook to handle real-time notification socket events
 */
export const useNotificationSocket = (onNewNotification, onUnreadCountUpdate) => {
  const { user, token } = useAuth();
  const onNewNotificationRef = useRef(onNewNotification);
  const onUnreadCountUpdateRef = useRef(onUnreadCountUpdate);

  // Sync refs with latest callbacks
  useEffect(() => {
    onNewNotificationRef.current = onNewNotification;
    onUnreadCountUpdateRef.current = onUnreadCountUpdate;
  });

  useEffect(() => {
    if (!user || !token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      socket.emit("joinUserRoom", String(user._id || user));
    });

    socket.on("notification:new", (notification) => {
      if (onNewNotificationRef.current) onNewNotificationRef.current(notification);
    });

    socket.on("notification:unreadCount", (data) => {
      if (onUnreadCountUpdateRef.current) onUnreadCountUpdateRef.current(data.unreadCount);
    });

    socket.on("error", (err) => {
      console.error("Notification Socket Error:", err);
    });

    return () => {
      if (socket) {
        socket.off();
        setTimeout(() => {
          socket.disconnect();
        }, 100);
      }
    };
  }, [token, String(user?._id || user)]);
};
