import { useState, useEffect, useCallback } from "react";
import { notificationApi } from "../api/notificationApi";
import { useAuth } from "../context/AuthContext";

/**
 * Custom hook for managing notifications state
 */
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (page = 1, type = "") => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications({ page, type });
      if (res.success) {
        setNotifications(res.data.notifications);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await notificationApi.getUnreadCount();
      if (res.success) {
        setUnreadCount(res.data.count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  const markAsRead = async (id) => {
    try {
      const res = await notificationApi.markAsRead(id);
      if (res.success) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await notificationApi.markAllAsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        return true;
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      return false;
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await notificationApi.deleteNotification(id);
      if (res.success) {
        const wasUnread = notifications.find(n => n._id === id)?.isRead === false;
        setNotifications(prev => prev.filter(n => n._id !== id));
        if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
      return false;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    pagination,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setUnreadCount,
    setNotifications
  };
};
