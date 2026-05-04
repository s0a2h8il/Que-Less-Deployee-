import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, ExternalLink, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NotificationItem from "./NotificationItem";
import { Button, Loader } from "..";
import NotificationEmptyState from "./NotificationEmptyState";

const NotificationDropdown = ({
  isOpen,
  notifications,
  loading,
  onClose,
  onMarkRead,
  onMarkAllRead,
}) => {
  const navigate = useNavigate();

  const handleItemClick = (notification) => {
    onMarkRead(notification._id);
    onClose();
    // Logic to navigate to related content
    if (notification.relatedQueue) {
      navigate(
        `/queue/${notification.relatedQueue._id || notification.relatedQueue}`,
      );
    } else if (notification.relatedExchange) {
      navigate("/exchanges");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-screen max-w-[380px] bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 border border-indigo-50 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-indigo-600" />
                <h3 className="font-black text-slate-800 uppercase tracking-wider text-xs">
                  Notifications
                </h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={onMarkAllRead}
                  className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors title='Mark all as read'"
                >
                  <CheckCheck size={16} />
                </button>
                <Link
                  to="/settings"
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 text-slate-400 rounded-xl transition-colors"
                >
                  <Settings size={16} />
                </Link>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="p-12 flex justify-center">
                  <Loader size="sm" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {notifications.slice(0, 5).map((note) => (
                    <NotificationItem
                      key={note._id}
                      notification={note}
                      onClick={handleItemClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8">
                  <NotificationEmptyState />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-50 bg-slate-50/50">
              <Button
                fullWidth
                variant="outline"
                size="sm"
                className="rounded-2xl gap-2 font-bold text-xs"
                rightIcon={<ExternalLink size={14} />}
                onClick={() => {
                  navigate("/notifications");
                  onClose();
                }}
              >
                View All Notifications
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
