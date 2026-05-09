import { useEffect, useRef, useMemo } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/**
 * Custom hook to handle real-time queue updates via Socket.io
 * Optimized to prevent unnecessary reconnections and handle room management efficiently.
 */
export const useQueueSocket = (queueIds, onQueueUpdate, onEvent) => {
  const { token } = useAuth();
  const socketRef = useRef(null);

  // Normalize IDs to an array
  const normalizedIds = useMemo(() => {
    if (!queueIds) return [];
    return Array.isArray(queueIds) ? queueIds.filter(Boolean) : [queueIds];
  }, [queueIds]);

  const onQueueUpdateRef = useRef(onQueueUpdate);
  const onEventRef = useRef(onEvent);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onQueueUpdateRef.current = onQueueUpdate;
    onEventRef.current = onEvent;
  });

  // Maintain socket connection
  useEffect(() => {
    if (!token) return;

    // Initialize socket with auth token
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"], // Fallback for stability
      reconnection: true,
      reconnectionAttempts: Infinity, // Keep alive like a stock ticker
      reconnectionDelay: 1000,
      randomizationFactor: 0.5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      normalizedIds.forEach((id) => {
        socket.emit("joinQueueRoom", id);
      });
    });

    socket.on("connect_error", (err) => {
      console.error("🔌 Socket Connection Error:", err.message);
    });

    socket.on("queueUpdated", (data) => {
      if (onQueueUpdateRef.current) onQueueUpdateRef.current(data);
    });

    socket.on("calledNext", (data) => {
      if (onQueueUpdateRef.current) onQueueUpdateRef.current(data);
      if (onEventRef.current) onEventRef.current({ type: "info", message: "Next user called", data });
    });

    socket.on("turnNear", (data) => {
      if (onEventRef.current)
        onEventRef.current({ type: "alert", message: "Your turn is coming up!", data });
    });

    socket.on("turnCalled", (data) => {
      if (onEventRef.current)
        onEventRef.current({ type: "success", message: "It's your turn!", data });
    });

    return () => {
      if (socket) {
        socket.off(); // Remove all listeners
        setTimeout(() => {
          socket.disconnect();
        }, 100);
      }
    };
  }, [token]);

  // Handle room joining/leaving when IDs change
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !normalizedIds.length) return;

    normalizedIds.forEach((id) => {
      socket.emit("joinQueueRoom", id);
    });

    // Optional: could track previous IDs to leave rooms, 
    // but usually joining multiple is fine for the session life.
  }, [normalizedIds.join(","), token]);

  return socketRef.current;
};
