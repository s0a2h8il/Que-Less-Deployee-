import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/**
 * Custom hook to handle real-time queue updates via Socket.io
 */
export const useQueueSocket = (queueId, onQueueUpdate, onEvent) => {
  const { token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!queueId) return;

    // Initialize socket with auth token
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to Socket.io");
      socket.emit("joinQueueRoom", queueId);
    });

    socket.on("queueUpdated", (data) => {
      if (onQueueUpdate) onQueueUpdate(data);
      if (onEvent) onEvent({ type: "update", message: data.message || "Queue updated live", data });
    });

    socket.on("turnNear", (data) => {
      if (onEvent) onEvent({ type: "alert", message: "Your turn is coming up!", data });
    });

    socket.on("calledNext", (data) => {
      if (onEvent) onEvent({ type: "info", message: "Next user called", data });
    });

    socket.on("turnCalled", (data) => {
      if (onEvent) onEvent({ type: "success", message: "It's your turn!", data });
    });

    socket.on("error", (err) => {
      console.error("Socket Error:", err);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [queueId, token]);

  return socketRef.current;
};
