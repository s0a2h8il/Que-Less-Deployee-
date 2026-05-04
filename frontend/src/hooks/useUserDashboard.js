import { useState, useEffect, useCallback } from "react";
import { userApi } from "../api/userApi";
import { notificationApi } from "../api/notificationApi";
import { useAuth } from "../context/AuthContext";

export const useUserDashboard = () => {
  const { user } = useAuth();
  const [activeQueues,   setActiveQueues]   = useState([]);
  const [notifications,  setNotifications]  = useState([]);
  const [unreadCount,    setUnreadCount]    = useState(0);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [queuesRes, notifRes, countRes] = await Promise.allSettled([
        userApi.getMyActiveQueues(),
        notificationApi.getNotifications({ limit: 5 }),
        notificationApi.getUnreadCount(),
      ]);

      if (queuesRes.status === "fulfilled" && queuesRes.value.success)
        setActiveQueues(queuesRes.value.data ?? []);

      if (notifRes.status === "fulfilled" && notifRes.value.success)
        setNotifications(notifRes.value.data?.notifications ?? []);

      if (countRes.status === "fulfilled" && countRes.value.success)
        setUnreadCount(countRes.value.data?.count ?? 0);

      // Only surface error if queues call failed (it's the main content)
      if (queuesRes.status === "rejected")
        setError(queuesRes.reason?.message || "Failed to load dashboard data");

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const stats = {
    activeCount:      activeQueues.length,
    nearestPosition:  activeQueues.length > 0
      ? Math.min(...activeQueues.map(q => q.position))
      : null,
    unreadCount,
  };

  return { user, activeQueues, notifications, unreadCount, stats, loading, error, refetch: fetchDashboardData };
};
