import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Download, RefreshCcw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useQueue } from "../hooks/useQueue";
import { useQueueSocket } from "../hooks/useQueueSocket";
import { Card, Toast, Loader, LiveActivityCard, Modal, Button as UiButton } from "../components";
import QueueStatusCard from "../components/queue/QueueStatusCard";
import UserPositionCard from "../components/queue/UserPositionCard";
import QueueActionPanel from "../components/queue/QueueActionPanel";
import QueueMembersPreview from "../components/queue/QueueMembersPreview";
import QueueLiveTimeline from "../components/queue/QueueLiveTimeline";

import { toPng } from "html-to-image";
import download from "downloadjs";
import QueueReceipt from "../components/queue/QueueReceipt";

const QueueDetail = () => {
  const { id } = useParams();
  const receiptRef = React.useRef(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [events, setEvents] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

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

  useQueueSocket(
    id,
    null, // Data updates handled by useQueue hook
    (event) => {
      setEvents((prev) => [event, ...prev].slice(0, 50));
      if (event.type === "alert" || event.type === "success") {
        setToast({ open: true, message: event.message, type: event.type });
      }
    },
  );

  const handleJoin = async () => {
    const res = await joinQueueHandler();
    if (res.success) {
      setToast({
        open: true,
        message: "You've successfully joined the queue!",
        type: "success",
      });
    } else {
      setToast({ open: true, message: res.message, type: "error" });
    }
  };

  const handleLeave = async () => {
    const res = await leaveQueueHandler();
    if (res.success) {
      setToast({
        open: true,
        message: "You have left the queue.",
        type: "info",
      });
    } else {
      setToast({ open: true, message: res.message, type: "error" });
    }
  };

  const openReceiptPreview = () => {
    if (!userMember) {
      setToast({ open: true, message: "Join the queue to get a receipt!", type: "info" });
      return;
    }
    setShowReceiptPreview(true);
  };

  const handleActualDownload = async () => {
    if (!receiptRef.current) return;
    
    setDownloading(true);
    // Allow any remaining layout shifts to settle
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: 2,
        backgroundColor: "#F7F4EF",
        cacheBust: true, // Force re-render of images/assets
      });
      download(dataUrl, `queue-receipt-${userMember.tokenNumber}.png`);
      setToast({ open: true, message: "Receipt downloaded!", type: "success" });
      setShowReceiptPreview(false);
    } catch (err) {
      console.error("Capture failed:", err);
      setToast({ open: true, message: "Failed to generate receipt", type: "error" });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <Loader />
      </div>
    );
  }

  if (error || !queue) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "var(--bg)" }}
      >
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Queue not found
          </h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            {error || "We couldn't find the queue you're looking for."}
          </p>
          <button
            onClick={fetchQueue}
            className="px-6 py-3 rounded-xl bg-[#81B29A] text-white font-bold flex items-center gap-2 mx-auto transition-transform active:scale-95"
          >
            <RefreshCcw size={18} />
            <span className="relative">Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const waitingMembers =
    queue.members?.filter((member) => member.status === "waiting") || [];
  const avgTime = queue.estimatedTimePerUser || 0;
  const businessInfo = queue.business || queue.businessId || {};
  const userAheadCount =
    userMember?.status === "waiting"
      ? waitingMembers.filter(
        (member) => member.tokenNumber < userMember.tokenNumber,
      ).length
      : userMember?.status === "called"
        ? 0
        : null;
  const userWaitTime =
    userAheadCount !== null ? userAheadCount * avgTime : null;

  const businessName = businessInfo?.name || "Business";
  const addressLine =
    [businessInfo?.address, businessInfo?.city].filter(Boolean).join(", ") ||
    "Address not shared";
  const queueSummary = queue.description?.trim()
    ? queue.description
    : "Live queue for walk-ins. Keep notifications on for updates.";

  return (
    <div className="w-full pb-24" style={{ background: "var(--bg)" }}>
      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--night-ink)] pt-12 pb-24 md:pb-32">
        {/* Decorative Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(129,178,154,0.12) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "5%",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(58,160,255,0.08) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Navigation / Breadcrumbs */}
        <div className="relative container mx-auto px-6 mb-12">
          <div className="flex items-center justify-between">
            <Link
              to="/explore"
              className="group flex items-center gap-2 text-sm font-bold transition-all"
              style={{ color: "rgba(247,244,239,0.5)" }}
            >
              <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                <ChevronLeft size={16} />
              </div>
              Back to Explore
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchQueue}
                className={`p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-lg ${loading ? 'animate-spin' : ''}`}
                title="Refresh Queue"
                disabled={loading}
              >
                <RefreshCcw size={18} />
              </button>
              <button
                onClick={openReceiptPreview}
                className={`p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all shadow-lg ${downloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Download Receipt"
                disabled={downloading}
              >
                <Download size={18} className={downloading ? 'animate-bounce' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Receipt logic is now handled directly via the preview modal to ensure data visibility */}

        {/* Hero Content */}
        <div className="relative container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left flex flex-col items-center md:items-start">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                style={{
                  background: "rgba(129,178,154,0.15)",
                  border: "1px solid rgba(129,178,154,0.25)",
                  color: "#81B29A",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#81B29A] animate-pulse" />
                Live Queue
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight"
                style={{ color: "#FFFFFF" }}
              >
                {queue.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl font-medium opacity-80"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                at <span className="font-bold text-white">{businessName}</span>
                <span className="block sm:inline sm:ml-2 opacity-60">• {addressLine}</span>
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4 w-full md:w-auto"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 sm:p-6 flex-1 md:min-w-[140px] text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-40 text-white">Waiting</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{waitingMembers.length} <span className="text-[10px] sm:text-sm font-normal opacity-40">Users</span></p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 sm:p-6 flex-1 md:min-w-[140px] text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-40 text-white">Avg Time</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{avgTime} <span className="text-[10px] sm:text-sm font-normal opacity-40">Min</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ─────────────────────────────────── */}
      <div className="container mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (Left/Center) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Real-time Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <LiveActivityCard queue={queue} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <UserPositionCard userMember={userMember} queue={queue} />
              </motion.div>
            </div>

            {/* Action Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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

            {/* Detailed Info Tabs/Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <QueueMembersPreview
                  members={queue.members}
                  currentToken={queue.currentToken}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <QueueLiveTimeline events={events} />
              </motion.div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Arrival Compass Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-8 relative overflow-hidden group">
                <div
                  className="absolute -top-12 -right-10 h-28 w-28 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ background: "#3AA0FF" }}
                />
                <div className="relative flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-[var(--text-primary)]">Arrival Compass</h4>
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                      style={{
                        background: "rgba(61,64,91,0.08)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {userWaitTime !== null ? "Personal" : "Preview"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 items-center">
                    <div className="flex items-center justify-center">
                      <div className="relative h-32 w-32">
                        {/* Ripple animations */}
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                              border: "1.5px solid rgba(129, 178, 154, 0.4)",
                              background: "radial-gradient(circle, rgba(129, 178, 154, 0.1) 0%, transparent 70%)",
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              delay: i * 1.3,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "conic-gradient(rgba(129,178,154,0.95) 0deg, rgba(190,227,248,0.9) 140deg, rgba(242,204,143,0.95) 260deg, rgba(224,122,95,0.9) 320deg, rgba(129,178,154,0.95) 360deg)",
                            boxShadow: "0 10px 26px rgba(61,64,91,0.12)",
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-3 rounded-full bg-white/90 border border-var(--border)" />
                        <motion.div
                          className="absolute inset-8 rounded-full bg-white/95 border border-black/5"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="absolute left-1/2 top-1/2 h-10 w-[2px] bg-[var(--text-muted)]"
                          style={{ transformOrigin: "bottom center", borderRadius: 999 }}
                          initial={{ x: "-50%", y: "-85%", rotate: 25 }}
                          animate={{ rotate: [25, 35, 20, 25] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-[var(--text-primary)] -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">ETA</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="rounded-xl p-3 bg-white/50 border border-var(--border) text-center sm:text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Ahead</p>
                          <p className="text-lg font-black text-[var(--text-primary)]">{userAheadCount !== null ? userAheadCount : "--"}</p>
                        </div>
                        <div className="rounded-xl p-3 bg-white/50 border border-var(--border) text-center sm:text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Wait</p>
                          <p className="text-lg font-black text-[var(--text-primary)]">{userWaitTime !== null ? `${userWaitTime}m` : "--"}</p>
                        </div>
                      </div>
                      <div className="rounded-2xl p-4 bg-white/80 border border-var(--border)">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Steps</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Live</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-2 rounded-full bg-gradient-to-r from-[#81B29A] to-transparent opacity-60" />
                          <div className="h-2 rounded-full bg-gradient-to-r from-[#3AA0FF] to-transparent opacity-40" />
                          <div className="h-2 rounded-full bg-gradient-to-r from-[#F2CC8F] to-transparent opacity-30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Queue Rules Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-8 relative overflow-hidden group">
                <div
                  className="absolute -top-12 -right-10 h-28 w-28 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ background: "#F2CC8F" }}
                />
                <div className="relative">
                  <h4 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Queue Rules</h4>
                  <ul className="space-y-6">
                    {[
                      { text: "Arrive 5 minutes before your turn.", color: "#F2CC8F" },
                      { text: "Missed calls result in being skipped.", color: "#3AA0FF" },
                      { text: "Leave anytime if you change your mind.", color: "#81B29A" }
                    ].map((rule, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]"
                          style={{
                            background: `${rule.color}20`,
                            color: rule.color,
                            border: `1px solid ${rule.color}40`,
                          }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{rule.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Queue Brief / Location */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-8 relative overflow-hidden group">
                <div
                  className="absolute -bottom-12 -left-10 h-28 w-28 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ background: "#81B29A" }}
                />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-[var(--text-primary)]">Queue Brief</h4>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/5 text-[var(--text-muted)] border border-var(--border)">Info</span>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/60 border border-var(--border)">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">About</p>
                      <p className="text-sm text-[var(--text-secondary)]">{queueSummary}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/60 border border-var(--border)">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Location</p>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{businessName}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{addressLine}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

        </div>
      </div>

      <Modal
        isOpen={showReceiptPreview}
        onClose={() => setShowReceiptPreview(false)}
        title="Queue Receipt Preview"
        maxWidth="max-w-2xl"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 overflow-hidden flex justify-center items-center min-h-[280px]">
            <div className="w-full max-w-[600px] relative">
              <QueueReceipt ref={receiptRef} queue={queue} userMember={userMember} preview={true} />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <UiButton
              variant="outline"
              fullWidth
              onClick={() => setShowReceiptPreview(false)}
              className="rounded-2xl h-12 order-2 sm:order-1"
            >
              Cancel
            </UiButton>
            <UiButton
              variant="info"
              fullWidth
              onClick={handleActualDownload}
              isLoading={downloading}
              className="rounded-2xl h-12 order-1 sm:order-2"
            >
              <Download size={18} className="mr-2" />
              Download
            </UiButton>
          </div>
        </div>
      </Modal>

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
