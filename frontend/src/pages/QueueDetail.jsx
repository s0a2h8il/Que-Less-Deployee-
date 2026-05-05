import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Share2, RefreshCcw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useQueue } from "../hooks/useQueue";
import { useQueueSocket } from "../hooks/useQueueSocket";
import { Button, Card, Loader, Toast } from "../components";

// Components
import QueueStatusCard from "../components/queue/QueueStatusCard";
import CurrentTokenCard from "../components/queue/CurrentTokenCard";
import UserPositionCard from "../components/queue/UserPositionCard";
import QueueActionPanel from "../components/queue/QueueActionPanel";
import QueueMembersPreview from "../components/queue/QueueMembersPreview";
import QueueLiveTimeline from "../components/queue/QueueLiveTimeline";

const QueueDetail = () => {
  const { id } = useParams();
  const {
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
  } = useQueue(id);

  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setEvents((prev) => [newEvent, ...prev].slice(0, 10));

    if (event.type === "alert" || event.type === "success") {
      setToast({ open: true, message: event.message, type: event.type });
    }
  };

  // Socket setup
  useQueueSocket(id, setQueue, addEvent);

  // Handlers
  const handleJoin = async () => {
    const res = await joinQueueHandler();
    if (res.success) {
      addEvent({ type: "success", message: "Successfully joined the queue!" });
    } else {
      setToast({ open: true, message: res.message, type: "error" });
    }
  };

  const handleLeave = async () => {
    const res = await leaveQueueHandler();
    if (res.success) {
      addEvent({ type: "info", message: "You left the queue." });
    } else {
      setToast({ open: true, message: res.message, type: "error" });
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToast({
      open: true,
      message: "Link copied to clipboard!",
      type: "info",
    });
  };

  if (loading) return <Loader fullPage message="Loading live queue data..." />;

  if (error || !queue) {
    return (
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6"
        style={{ background: "var(--bg)" }}
      >
        <div
          className="h-20 w-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(234,82,111,0.10)" }}
        >
          <AlertTriangle size={36} style={{ color: "#EA526F" }} />
        </div>
        <h2
          className="text-3xl font-black mb-2"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--text-primary)",
          }}
        >
          Queue Not Found
        </h2>
        <p className="max-w-md mb-8" style={{ color: "var(--text-muted)" }}>
          {error ||
            "The queue you are looking for does not exist or has been deleted."}
        </p>
        <div className="flex gap-3">
          <Link
            to="/explore"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 whitespace-nowrap"
            style={{
              border: "1.5px solid var(--border-strong)",
              color: "var(--text-secondary)",
              background: "var(--surface)",
              fontFamily: "var(--font-heading)",
            }}
          >
            <ChevronLeft
              size={15}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to Explore
          </Link>

          <button
            onClick={fetchQueue}
            className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap"
            style={{
              background: "#3AA0FF",
              color: "#0B1320",
              fontFamily: "var(--font-heading)",
              boxShadow: "0 4px 14px rgba(58,160,255,0.35)",
            }}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <RefreshCcw
              size={15}
              className="relative transition-transform duration-500 group-hover:rotate-180"
            />
            <span className="relative">Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24" style={{ background: "var(--bg)" }}>
      {/* Header Navigation */}
      <div
        className="py-4 mb-8"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            to="/explore"
            className="flex items-center gap-2 text-sm font-semibold transition-colors whitespace-nowrap"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#3AA0FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <ChevronLeft size={16} />
            Back to Explore
          </Link>
          <button
            onClick={copyShareLink}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#3AA0FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Status Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <QueueStatusCard queue={queue} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CurrentTokenCard queue={queue} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <UserPositionCard userMember={userMember} queue={queue} />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QueueActionPanel
                queue={queue}
                userMember={userMember}
                onJoin={handleJoin}
                onLeave={handleLeave}
                joining={joining}
                leaving={leaving}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="h-full"
              >
                <QueueMembersPreview
                  members={queue.members}
                  currentToken={queue.currentToken}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="h-full"
              >
                <QueueLiveTimeline events={events} />
              </motion.div>
            </div>
          </div>

          {/* Sidebar / Info Column (Optional, can add more info here later) */}
          <div className="space-y-8">
            <Card className="p-8 bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
              <h4 className="text-xl font-bold mb-4">Queue Rules</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    1
                  </div>
                  Please arrive 5 minutes before your estimated turn.
                </li>
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    2
                  </div>
                  If you miss your call, your token will be marked as skipped.
                </li>
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    3
                  </div>
                  You can leave the queue at any time if you change your mind.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Toast
        isOpen={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default QueueDetail;
