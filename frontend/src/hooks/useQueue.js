import { useState, useEffect, useCallback, useMemo } from "react";
import { queueApi } from "../api/queueApi";
import { useAuth } from "../context/AuthContext";
import { useQueueSocket } from "./useQueueSocket";

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
        const { queue: queueData, stats, userStatus } = res.data;
        setQueue({ ...queueData, stats, userStatus });
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

  // Real-time updates integration
  useQueueSocket(
    queueId,
    (updatedData) => {
      const incomingId = updatedData?.queueId || updatedData?._id;
      if (incomingId !== queueId) return;

      setQueue((prev) => {
        if (!prev) return prev;

        // Merge stats if they exist in payload
        const stats = { 
          ...prev.stats,
          totalWaitingUsers: updatedData.waitingCount ?? prev.stats?.totalWaitingUsers,
          currentToken: updatedData.currentToken ?? prev.stats?.currentToken,
          completedCount: updatedData.completedCount ?? prev.stats?.completedCount,
          totalJoined: updatedData.totalJoined ?? prev.stats?.totalJoined,
        };

        return {
          ...prev,
          ...updatedData,
          stats
        };
      });
    }
  );

  const joinQueueHandler = async () => {
    if (!isAuthenticated)
      return { success: false, message: "Please login to join" };
    setJoining(true);
    try {
      const res = await queueApi.joinQueue(queueId);
      if (res.success) {
        await fetchQueue();
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to join queue",
      };
    } finally {
      setJoining(false);
    }
  };

  const leaveQueueHandler = async () => {
    setLeaving(true);
    try {
      const res = await queueApi.leaveQueue(queueId);
      if (res.success) {
        await fetchQueue();
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to leave queue",
      };
    } finally {
      setLeaving(false);
    }
  };

  // Derived state for the current logged-in user's membership
  const userMember = useMemo(() => {
    if (!user || !queue?.members?.length) return null;

    const matches = queue.members.filter((member) => {
      const rawId =
        typeof member.userId === "object"
          ? member.userId?._id || member.userId?.id
          : member.userId;

      if (!rawId) return false;
      return rawId.toString() === user._id?.toString();
    });

    if (!matches.length) return null;

    return matches.reduce((latest, current) => {
      const latestTime = new Date(
        latest.joinedAt ||
          latest.calledAt ||
          latest.completedAt ||
          latest.leftAt ||
          latest.skippedAt ||
          0,
      ).getTime();
      const currentTime = new Date(
        current.joinedAt ||
          current.calledAt ||
          current.completedAt ||
          current.leftAt ||
          current.skippedAt ||
          0,
      ).getTime();

      return currentTime >= latestTime ? current : latest;
    }, matches[0]);
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
