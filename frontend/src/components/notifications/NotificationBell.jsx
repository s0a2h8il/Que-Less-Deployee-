import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";
import NotificationDropdown from "./NotificationDropdown";
import { cn } from "../../utils/cn";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    fetchNotifications, 
    fetchUnreadCount,
    markAsRead, 
    markAllAsRead,
    setUnreadCount,
    setNotifications
  } = useNotifications();

  const bellRef = useRef(null);

  const handleNewNotification = React.useCallback((newNote) => {
    setNotifications(prev => [newNote, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);
  }, [setNotifications, setUnreadCount]);

  const handleUnreadCountUpdate = React.useCallback((newCount) => {
    setUnreadCount(newCount);
  }, [setUnreadCount]);

  // Real-time updates via socket
  useNotificationSocket(handleNewNotification, handleUnreadCountUpdate);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchNotifications();
            fetchUnreadCount();
          }
        }}
        className={cn(
          "relative p-2.5 rounded-2xl transition-all duration-300 group",
          isOpen 
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
        )}
      >
        <Bell size={20} className={cn("transition-transform group-hover:rotate-12", isOpen && "animate-none")} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[10px] font-black text-white items-center justify-center border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      <NotificationDropdown
        isOpen={isOpen}
        notifications={notifications}
        loading={loading}
        onClose={() => setIsOpen(false)}
        onMarkRead={markAsRead}
        onMarkAllRead={markAllAsRead}
      />
    </div>
  );
};

export default NotificationBell;
