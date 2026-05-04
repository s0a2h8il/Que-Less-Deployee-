import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  RefreshCcw,
  Search,
  Settings,
} from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import NotificationItem from "../components/notifications/NotificationItem";
import NotificationEmptyState from "../components/notifications/NotificationEmptyState";
import { Loader, Button } from "../components";
import { Toast } from "../components/ui/Toast";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const {
    notifications,
    loading,
    error,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const handleItemClick = (notification) => {
    markAsRead(notification._id);
    if (notification.relatedQueue) {
      navigate(
        `/queue/${notification.relatedQueue._id || notification.relatedQueue}`,
      );
    } else if (notification.relatedExchange) {
      navigate("/exchanges");
    }
  };

  const handleMarkAll = async () => {
    const success = await markAllAsRead();
    if (success) showToast("All notifications marked as read", "success");
  };

  const handleDelete = async (id) => {
    const success = await deleteNotification(id);
    if (success) showToast("Notification deleted", "info");
  };

  const filters = [
    { label: "All", value: "" },
    { label: "Queues", value: "queue_" },
    { label: "Exchanges", value: "exchange_" },
    { label: "Turns", value: "turn_" },
  ];

  const filteredNotes = filter
    ? notifications.filter((n) => n.type.startsWith(filter))
    : notifications;

  return (
    <div className="w-full bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <Bell className="text-indigo-600" size={36} />
              Notifications
            </h1>
            <p className="text-slate-500 font-medium">
              Stay updated with your queue activities and alerts
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-2xl gap-2 bg-white"
              onClick={() => fetchNotifications(1, filter)}
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button
              onClick={handleMarkAll}
              variant="outline"
              className="rounded-2xl gap-2 bg-white"
              disabled={!notifications.some((n) => !n.isRead)}
            >
              <CheckCheck size={18} />
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.value)}
              className={`
                px-6 py-2 rounded-2xl font-bold text-sm transition-all
                ${
                  filter === f.value
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-100"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-indigo-50 overflow-hidden">
          {loading && notifications.length === 0 ? (
            <div className="p-20 flex justify-center">
              <Loader size="lg" />
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {filteredNotes.map((note) => (
                <NotificationItem
                  key={note._id}
                  notification={note}
                  onClick={handleItemClick}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="p-12">
              <NotificationEmptyState
                title={filter ? "No matching notifications" : "All caught up!"}
                message={
                  filter
                    ? "Try changing your filter settings."
                    : "You have no new notifications to show."
                }
              />
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-center gap-2">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchNotifications(i + 1, filter)}
                  className={`
                    w-10 h-10 rounded-xl font-bold transition-all
                    ${
                      pagination.page === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-100"
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Notifications;
