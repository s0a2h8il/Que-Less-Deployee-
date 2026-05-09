import { useState, useEffect, useCallback, useMemo } from "react";
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
      
      // Fetch businesses and queues list
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

      // If a queue is currently selected, refresh its specific details too
      if (selectedQueue?._id) {
        try {
          const detailRes = await adminApi.getQueueDetails(selectedQueue._id);
          const queueBase = detailRes?.data?.queue || detailRes?.data || detailRes;
          const stats = detailRes?.data?.stats || {};
          setSelectedQueue({ ...queueBase, stats });
        } catch (err) {
          console.error("Failed to refresh selected queue details:", err);
        }
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
  }, [selectedQueue?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const queueIds = useMemo(
    () => queues.map((queue) => queue._id).filter(Boolean),
    [queues],
  );

  const mergeQueueUpdate = useCallback((queue, updatedData) => {
    const merged = { ...queue, ...updatedData };

    if (updatedData.members) {
      merged.members = updatedData.members;
    }

    const waitingCount = updatedData.waitingCount ?? queue.stats?.waitingCount;
    const completedCount = updatedData.completedCount ?? queue.stats?.completedCount;
    const totalJoined = updatedData.totalJoined ?? queue.stats?.totalJoined;
    const currentToken = updatedData.currentToken ?? queue.stats?.currentToken;

    merged.stats = {
      ...queue.stats,
      waitingCount,
      completedCount,
      totalJoined,
      currentToken,
    };

    return merged;
  }, []);

  // Real-time updates for selected queue
  useQueueSocket(
    queueIds,
    (updatedData) => {
      if (!updatedData) return;

      // The socket sends a payload, not always a full queue object
      // If it's a payload with queueId, we should use that
      const qId = updatedData.queueId || updatedData._id;
      if (!qId) return;

      // Update selected queue if it's the one being updated
      setSelectedQueue((prev) => {
        if (!prev || prev._id !== qId) return prev;
        const merged = mergeQueueUpdate(prev, updatedData);
        return { ...merged, _lastUpdate: Date.now() }; // Trigger animation
      });

      // Update the queue list as well
      setQueues((prev) =>
        prev.map((q) => {
          if (q._id === qId) {
            const merged = mergeQueueUpdate(q, updatedData);
            return { ...merged, _lastUpdate: Date.now() };
          }
          return q;
        }),
      );
    },
    (event) => {
      if (event.type === "info") {
        showToast(event.message, "info");
      }
    },
  );

  const createBusinessHandler = async (formData) => {
    try {
      const response = await adminApi.createBusiness(formData);
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
      const res = await adminApi.callNext(selectedQueue._id);
      const updatedQueue = res?.data?.queue || res?.data || res;

      // Update selected queue immediately with correct member status
      setSelectedQueue((prev) => {
        if (!prev) return prev;
        
        // Find and update the member that was called
        const updatedMembers = prev.members?.map(m => 
          (updatedQueue.calledUser && m.tokenNumber === updatedQueue.calledUser.tokenNumber)
            ? { ...m, status: "called", calledAt: new Date().toISOString() }
            : m.status === "called" 
              ? { ...m, status: "completed", completedAt: new Date().toISOString() } // auto-complete previous
              : m
        );

        return {
          ...prev,
          ...updatedQueue,
          status: "active",
          members: updatedMembers,
          stats: {
            ...prev.stats,
            currentToken: updatedQueue.currentToken || prev.stats.currentToken,
            waitingCount: Math.max(0, (prev.stats.waitingCount || 0) - 1),
            completedCount: (prev.stats.completedCount || 0) + 1,
          },
        };
      });

      // Update in the main list
      setQueues((prev) =>
        prev.map((q) =>
          q._id === selectedQueue._id
            ? {
                ...q,
                status: "active",
                stats: { 
                  ...q.stats, 
                  currentToken: updatedQueue.currentToken,
                  waitingCount: Math.max(0, (q.stats.waitingCount || 0) - 1),
                  completedCount: (q.stats.completedCount || 0) + 1,
                },
              }
            : q,
        ),
      );

      showToast("Next customer called!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to call next", "error");
    }
  };

  const pauseHandler = async () => {
    if (!selectedQueue) return;
    try {
      const res = await adminApi.pauseQueue(selectedQueue._id);
      const updatedStatus = res?.data?.status || "paused";

      setSelectedQueue((prev) => ({ ...prev, status: updatedStatus }));
      setQueues((prev) =>
        prev.map((q) =>
          q._id === selectedQueue._id ? { ...q, status: updatedStatus } : q,
        ),
      );

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
      const res = await adminApi.resumeQueue(selectedQueue._id);
      const updatedStatus = res?.data?.status || "active";

      setSelectedQueue((prev) => ({ ...prev, status: updatedStatus }));
      setQueues((prev) =>
        prev.map((q) =>
          q._id === selectedQueue._id ? { ...q, status: updatedStatus } : q,
        ),
      );

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
      const res = await adminApi.closeQueue(selectedQueue._id);
      const updatedData = res?.data || res;

      setSelectedQueue((prev) => ({
        ...prev,
        status: "closed",
        members: prev.members.map((m) =>
          ["waiting", "called"].includes(m.status)
            ? { ...m, status: "cancelled" }
            : m,
        ),
      }));
      setQueues((prev) =>
        prev.map((q) =>
          q._id === selectedQueue._id ? { ...q, status: "closed" } : q,
        ),
      );

      showToast("Queue closed", "error");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to close queue",
        "error",
      );
    }
  };

  const startHandler = async () => {
    if (!selectedQueue) return;
    try {
      const res = await adminApi.startQueue(selectedQueue._id);
      const freshQueue = res?.data?.queue || res?.data || res;

      // Start queue returns a fresh queue object with 0 members and active status
      setSelectedQueue({
        ...freshQueue,
        stats: {
          waitingCount: 0,
          completedCount: 0,
          totalJoined: 0,
          currentToken: 0,
        },
      });
      setQueues((prev) =>
        prev.map((q) =>
          q._id === selectedQueue._id
            ? {
                ...q,
                status: "active",
                stats: { ...q.stats, currentToken: 0, waitingCount: 0 },
              }
            : q,
        ),
      );

      showToast("Queue started for new session!", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to start queue",
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
    startHandler,
    selectQueue,
    refetch: fetchData,
  };
};
