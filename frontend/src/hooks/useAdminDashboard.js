import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../api/adminApi";
import { useQueueSocket } from "./useQueueSocket";

/**
 * Custom hook for Admin Dashboard state management
 */
export const useAdminDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bizResult, queueResult] = await Promise.allSettled([
        adminApi.getMyBusinesses(),
        adminApi.getMyQueues(),
      ]);

      if (bizResult.status === "fulfilled") {
        const bizData = bizResult.value;
        setBusinesses(bizData?.data?.businesses || bizData?.data || []);
      } else {
        setBusinesses([]);
      }

      if (queueResult.status === "fulfilled") {
        const queueData = queueResult.value;
        setQueues(queueData?.data?.queues || queueData?.data || []);
        setError(null);
      } else {
        setQueues([]);
        setError(
          queueResult.reason?.response?.data?.message ||
            "Failed to load dashboard data",
        );
      }

      if (
        bizResult.status === "rejected" &&
        queueResult.status === "fulfilled"
      ) {
        showToast(
          bizResult.reason?.response?.data?.message ||
            "Failed to load businesses",
          "error",
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
      showToast("Error loading dashboard", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time updates for selected queue
  useQueueSocket(
    selectedQueue?._id,
    (updatedData) => {
      if (!updatedData) return;

      // The socket sends a payload, not always a full queue object
      // If it's a payload with queueId, we should use that
      const qId = updatedData.queueId || updatedData._id;
      if (!qId) return;

      // Update selected queue if it's the one being updated
      setSelectedQueue((prev) => {
        if (!prev || prev._id !== qId) return prev;

        // Merge the update (handles both full queue objects and partial status updates)
        const merged = { ...prev, ...updatedData };
        // If the backend sent stats separately or flat, we might need to handle it
        if (updatedData.waitingCount !== undefined) {
          merged.stats = {
            ...merged.stats,
            waitingCount: updatedData.waitingCount,
          };
        }
        return merged;
      });

      // Update the queue list as well
      setQueues((prev) =>
        prev.map((q) => (q._id === qId ? { ...q, ...updatedData } : q)),
      );
    },
    (event) => {
      if (event.type === "info") {
        showToast(event.message, "info");
      }
    },
  );

  const createBusinessHandler = async (data) => {
    try {
      const response = await adminApi.createBusiness(data);
      const newBiz = response?.data?.business || response?.data || response;
      setBusinesses((prev) => [...prev, newBiz]);
      showToast("Business created successfully!", "success");
      return newBiz;
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to create business",
        "error",
      );
      throw err;
    }
  };

  const createQueueHandler = async (data) => {
    try {
      const response = await adminApi.createQueue(data);
      const newQueue = response?.data?.queue || response?.data || response;
      setQueues((prev) => [...prev, newQueue]);
      showToast("Queue created successfully!", "success");
      return newQueue;
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to create queue",
        "error",
      );
      throw err;
    }
  };

  const selectQueue = async (queueId) => {
    try {
      setLoading(true);
      const response = await adminApi.getQueueDetails(queueId);
      const queueBase = response?.data?.queue || response?.data || response;
      const stats = response?.data?.stats || {};

      setSelectedQueue({ ...queueBase, stats });
    } catch (err) {
      showToast("Failed to load queue details", "error");
    } finally {
      setLoading(false);
    }
  };

  const callNextHandler = async () => {
    if (!selectedQueue) return;
    try {
      await adminApi.callNext(selectedQueue._id);
      showToast("Next customer called!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to call next", "error");
    }
  };

  const pauseHandler = async () => {
    if (!selectedQueue) return;
    try {
      await adminApi.pauseQueue(selectedQueue._id);
      showToast("Queue paused", "warning");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to pause queue",
        "error",
      );
    }
  };

  const resumeHandler = async () => {
    if (!selectedQueue) return;
    try {
      await adminApi.resumeQueue(selectedQueue._id);
      showToast("Queue resumed", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to resume queue",
        "error",
      );
    }
  };

  const closeHandler = async () => {
    if (!selectedQueue) return;
    try {
      await adminApi.closeQueue(selectedQueue._id);
      showToast("Queue closed", "error");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to close queue",
        "error",
      );
    }
  };

  return {
    businesses,
    queues,
    selectedQueue,
    loading,
    error,
    toast,
    hideToast,
    createBusinessHandler,
    createQueueHandler,
    callNextHandler,
    pauseHandler,
    resumeHandler,
    closeHandler,
    selectQueue,
    refetch: fetchData,
  };
};
