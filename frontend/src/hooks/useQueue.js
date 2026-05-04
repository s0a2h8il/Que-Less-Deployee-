import { useState, useEffect, useCallback, useMemo } from "react";
import { queueApi } from "../api/queueApi";
import { useAuth } from "../context/AuthContext";

/**
 * Custom hook to manage queue data and interactions
 */
export const useQueue = (queueId) => {
  const { user, isAuthenticated } = useAuth();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const fetchQueue = useCallback(async () => {
    if (!queueId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await queueApi.getQueueById(queueId);
      if (res.success) {
        setQueue(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch queue details");
    } finally {
      setLoading(false);
    }
  }, [queueId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const joinQueueHandler = async () => {
    if (!isAuthenticated) return { success: false, message: "Please login to join" };
    setJoining(true);
    try {
      const res = await queueApi.joinQueue(queueId);
      if (res.success) {
        setQueue(res.data);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to join queue" };
    } finally {
      setJoining(false);
    }
  };

  const leaveQueueHandler = async () => {
    setLeaving(true);
    try {
      const res = await queueApi.leaveQueue(queueId);
      if (res.success) {
        setQueue(res.data);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to leave queue" };
    } finally {
      setLeaving(false);
    }
  };

  // Derived state for the current logged-in user's membership
  const userMember = useMemo(() => {
    if (!user || !queue) return null;
    return queue.members?.find(m => m.userId === user._id) || null;
  }, [user, queue]);

  return {
    queue,
    loading,
    error,
    joining,
    leaving,
    userMember,
    fetchQueue,
    joinQueueHandler,
    leaveQueueHandler,
    setQueue,
  };
};
