import React, { useEffect, useState } from "react";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import AdminSidebar from "../../components/dashboard/admin/AdminSidebar";
import CreateBusinessForm from "../../components/dashboard/admin/CreateBusinessForm";
import CreateQueueForm from "../../components/dashboard/admin/CreateQueueForm";
import QueueList from "../../components/dashboard/admin/QueueList";
import QueueControlPanel from "../../components/dashboard/admin/QueueControlPanel";
import WaitingUsersList from "../../components/dashboard/admin/WaitingUsersList";
import { Loader } from "../../components/ui/Loader";
import { Toast } from "../../components/ui/Toast";
import {
  Plus,
  RefreshCcw,
  Building2,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateBiz, setShowCreateBiz] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => setIsDesktop(event.matches);

    handleChange(media);
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  // Close sidebar on mobile when tab changes
  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [activeTab, isDesktop]);

  const {
    businesses,
    queues,
    selectedQueue,
    loading,
    error,
    createBusinessHandler,
    createQueueHandler,
    callNextHandler,
    pauseHandler,
    resumeHandler,
    closeHandler,
    startHandler,
    selectQueue,
    refetch,
    toast,
    hideToast,
  } = useAdminDashboard();

  if (loading && !businesses?.length && !queues?.length) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: "var(--night-ink)" }}
      >
        <Loader size="lg" />
      </div>
    );
  }

  const sidebarWidth = isDesktop ? (isSidebarOpen ? 256 : 80) : 256;
  const sidebarX = isDesktop ? 0 : isSidebarOpen ? 0 : "-100%";
  const mainOffset = isDesktop ? (isSidebarOpen ? 256 : 80) : 0;
  const showMobileOverlay = !isDesktop && isSidebarOpen;
  const toggleLabel = isDesktop
    ? isSidebarOpen
      ? "Collapse"
      : "Expand"
    : isSidebarOpen
      ? "Close"
      : "Menu";

  /* ── Tab Content ─────────────────────────────────────────── */
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Section header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#F7F4EF",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Operator Overview
                </h1>
                <p
                  style={{
                    color: "rgba(247,244,239,0.45)",
                    fontFamily: "var(--font-body)",
                    marginTop: 2,
                  }}
                >
                  Real-time status of your queues
                </p>
              </div>
              <button
                onClick={refetch}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap sm:w-auto disabled:opacity-50"
                style={{
                  background: "rgba(247,244,239,0.06)",
                  border: "1px solid rgba(247,244,239,0.12)",
                  color: "rgba(247,244,239,0.60)",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = "rgba(58,160,255,0.40)";
                    e.currentTarget.style.color = "#3AA0FF";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(247,244,239,0.12)";
                  e.currentTarget.style.color = "rgba(247,244,239,0.60)";
                }}
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCcw size={15} />
                </motion.div>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {selectedQueue ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <QueueControlPanel
                    queue={selectedQueue}
                    onCallNext={callNextHandler}
                    onPause={pauseHandler}
                    onResume={resumeHandler}
                    onClose={closeHandler}
                    onStart={startHandler}
                  />
                  {/* Info panel */}
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(58,160,255,0.12) 0%, rgba(242,179,61,0.06) 100%)",
                      border: "1px solid rgba(58,160,255,0.20)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(58,160,255,0.20)" }}
                      >
                        <Zap size={15} style={{ color: "#3AA0FF" }} />
                      </div>
                      <h3
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontWeight: 700,
                          color: "#F7F4EF",
                        }}
                      >
                        Pro Tip
                      </h3>
                    </div>
                    <p
                      style={{
                        color: "rgba(247,244,239,0.55)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9rem",
                      }}
                    >
                      Use "Call Next" to notify the next person in line —
                      they'll receive an instant push notification on their
                      device.
                    </p>
                  </div>
                </div>
                <div>
                  <WaitingUsersList members={selectedQueue.members} />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      color: "#F7F4EF",
                      fontSize: "1.2rem",
                    }}
                  >
                    Your Queues
                  </h2>
                  <button
                    onClick={() => setActiveTab("create-queue")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap sm:w-auto"
                    style={{
                      background: "#3AA0FF",
                      color: "#0B1320",
                      fontFamily: "var(--font-heading)",
                      boxShadow: "0 4px 14px rgba(58,160,255,0.35)",
                    }}
                  >
                    <Plus size={15} />
                    New Queue
                  </button>
                </div>
                <QueueList queues={queues} onSelect={selectQueue} />
              </div>
            )}
          </div>
        );

      case "businesses":
        return (
          <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#F7F4EF",
                  letterSpacing: "-0.02em",
                }}
              >
                My Businesses
              </h1>
              <button
                onClick={() => setShowCreateBiz(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all whitespace-nowrap sm:w-auto"
                style={{
                  background: "#3AA0FF",
                  color: "#0B1320",
                  fontFamily: "var(--font-heading)",
                  boxShadow: "0 4px 14px rgba(58,160,255,0.35)",
                }}
              >
                <Plus size={16} />
                Register Business
              </button>
            </div>

            {showCreateBiz ? (
              <CreateBusinessForm
                onSubmit={createBusinessHandler}
                onCancel={() => setShowCreateBiz(false)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {businesses?.length > 0 ? (
                  businesses.map((biz) => (
                    <div
                      key={String(biz._id)}
                      className="rounded-2xl p-6 transition-all"
                      style={{
                        background: "rgba(247,244,239,0.04)",
                        border: "1px solid rgba(247,244,239,0.10)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(58,160,255,0.30)";
                        e.currentTarget.style.background =
                          "rgba(58,160,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(247,244,239,0.10)";
                        e.currentTarget.style.background =
                          "rgba(247,244,239,0.04)";
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: "rgba(58,160,255,0.15)" }}
                      >
                        <Building2 size={20} style={{ color: "#3AA0FF" }} />
                      </div>
                      <h3
                        className="font-bold mb-1"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "#F7F4EF",
                        }}
                      >
                        {biz.name}
                      </h3>
                      <p
                        className="text-sm mb-3"
                        style={{ color: "rgba(247,244,239,0.45)" }}
                      >
                        {biz.category} · {biz.city}
                      </p>
                      {biz.openingTime && (
                        <p
                          className="text-xs"
                          style={{ color: "rgba(247,244,239,0.30)" }}
                        >
                          {biz.openingTime} – {biz.closingTime}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    className="col-span-full flex flex-col items-center justify-center py-16 rounded-2xl text-center"
                    style={{ border: "1px dashed rgba(247,244,239,0.15)" }}
                  >
                    <Building2
                      size={40}
                      style={{
                        color: "rgba(247,244,239,0.20)",
                        marginBottom: 16,
                      }}
                    />
                    <h3
                      className="font-bold mb-1"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "rgba(247,244,239,0.60)",
                      }}
                    >
                      No businesses registered
                    </h3>
                    <p
                      className="text-sm mb-5"
                      style={{ color: "rgba(247,244,239,0.35)" }}
                    >
                      Register a business first to start creating queues
                    </p>
                    <button
                      onClick={() => setShowCreateBiz(true)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                      style={{
                        background: "#3AA0FF",
                        color: "#0B1320",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Add Business
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case "queues":
        return (
          <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#F7F4EF",
                  letterSpacing: "-0.02em",
                }}
              >
                Manage Queues
              </h1>
              <button
                onClick={() => setActiveTab("create-queue")}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap sm:w-auto"
                style={{
                  background: "#3AA0FF",
                  color: "#0B1320",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <Plus size={16} />
                New Queue
              </button>
            </div>
            <QueueList
              queues={queues}
              onSelect={(id) => {
                selectQueue(id);
                setActiveTab("overview");
              }}
            />
          </div>
        );

      case "create-queue":
        return (
          <div className="space-y-8">
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2rem",
                fontWeight: 800,
                color: "#F7F4EF",
                letterSpacing: "-0.02em",
              }}
            >
              Create Queue
            </h1>
            <CreateQueueForm
              businesses={businesses}
              onSubmit={createQueueHandler}
              onCancel={() => setActiveTab("overview")}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="flex min-h-screen relative"
      style={{ background: "var(--night-ink)" }}
    >
      <AnimatePresence>
        {showMobileOverlay && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close sidebar"
            className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 z-30 h-screen"
        initial={false}
        animate={{ 
          width: isDesktop ? sidebarWidth : 256, 
          x: isDesktop ? 0 : (isSidebarOpen ? 0 : "-100%") 
        }}
        transition={{ 
          duration: 0.45, 
          ease: [0.16, 1, 0.3, 1] // Custom quint ease for smoother motion
        }}
      >
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={isDesktop && !isSidebarOpen}
        />
      </motion.aside>

      <motion.main
        className="flex-1 min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        animate={{ marginLeft: mainOffset }}
        transition={{ 
          duration: 0.45, 
          ease: [0.16, 1, 0.3, 1] 
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm"
              style={{
                background: isSidebarOpen
                  ? "rgba(247,244,239,0.06)"
                  : "rgba(58,160,255,0.12)",
                border: isSidebarOpen
                  ? "1px solid rgba(247,244,239,0.12)"
                  : "1px solid rgba(58,160,255,0.30)",
                color: isSidebarOpen ? "rgba(247,244,239,0.60)" : "#3AA0FF",
                fontFamily: "var(--font-heading)",
              }}
              aria-label={
                toggleLabel === "Menu"
                  ? "Open sidebar"
                  : `${toggleLabel} sidebar`
              }
            >
              {isSidebarOpen ? (
                <PanelLeftClose
                  size={16}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
              ) : (
                <PanelLeftOpen
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              )}
              <span>{toggleLabel}</span>
            </button>
          </div>

          {error && (
            <div
              className="mb-6 p-4 rounded-2xl flex justify-between items-center"
              style={{
                background: "rgba(234,82,111,0.10)",
                border: "1px solid rgba(234,82,111,0.25)",
                color: "#EA526F",
              }}
            >
              <p style={{ fontFamily: "var(--font-body)" }}>{error}</p>
              <button
                onClick={refetch}
                className="text-sm font-semibold px-3 py-1 rounded-lg"
                style={{ background: "rgba(234,82,111,0.15)" }}
              >
                Retry
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

export default AdminDashboard;
