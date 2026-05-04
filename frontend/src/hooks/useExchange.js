import { useState, useEffect, useCallback } from "react";
import { exchangeApi } from "../api/exchangeApi";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/**
 * Custom hook for managing spot exchange state and socket events
 */
export const useExchange = () => {
  const { user, token } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await exchangeApi.getMyRequests();
      if (res.success) {
        setIncomingRequests(res.data.incoming);
        setOutgoingRequests(res.data.outgoing);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await exchangeApi.getHistory();
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch history");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchHistory();

      // Socket integration for real-time notifications
      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        socket.emit("joinUserRoom", user._id);
      });

      socket.on("exchangeRequestReceived", () => {
        fetchRequests();
      });

      socket.on("exchangeAccepted", () => {
        fetchRequests();
        fetchHistory();
      });

      socket.on("exchangeRejected", () => {
        fetchRequests();
        fetchHistory();
      });

      return () => socket.disconnect();
    }
  }, [user, token, fetchRequests, fetchHistory]);

  const createRequest = async (data) => {
    try {
      const res = await exchangeApi.createRequest(data);
      if (res.success) {
        setOutgoingRequests((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      throw err.response?.data?.message || "Failed to send request";
    }
  };

  const acceptRequest = async (id) => {
    try {
      const res = await exchangeApi.acceptRequest(id);
      if (res.success) {
        setIncomingRequests((prev) => prev.filter((r) => r._id !== id));
        fetchHistory();
        return res.data;
      }
    } catch (err) {
      throw err.response?.data?.message || "Failed to accept request";
    }
  };

  const rejectRequest = async (id) => {
    try {
      const res = await exchangeApi.rejectRequest(id);
      if (res.success) {
        setIncomingRequests((prev) => prev.filter((r) => r._id !== id));
        fetchHistory();
        return res.data;
      }
    } catch (err) {
      throw err.response?.data?.message || "Failed to reject request";
    }
  };

  return {
    incomingRequests,
    outgoingRequests,
    history,
    loading,
    error,
    createRequest,
    acceptRequest,
    rejectRequest,
    refresh: () => {
      fetchRequests();
      fetchHistory();
    },
  };
};
