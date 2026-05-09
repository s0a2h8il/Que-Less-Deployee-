import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Home,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryIcon } from "../../utils/categoryIcons";
import { useAuth } from "../../context/AuthContext";
import ProfileCard from "../../components/dashboard/user/ProfileCard";

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  // For Super Admins, if no tab is specified, default to settings since other tabs are hidden
  useEffect(() => {
    if (user?.role === "superadmin" && !searchParams.get("tab") && activeTab === "overview") {
      setActiveTab("settings");
    }
  }, [user, searchParams, activeTab]);
  const [showCreateBiz, setShowCreateBiz] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [editingQueue, setEditingQueue] = useState(null);
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

  // Sync tab from URL if it changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
    updateBusinessHandler,
    deleteBusinessHandler,
    createQueueHandler,
    updateQueueHandler,
    deleteQueueHandler,
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
                <QueueList
                  queues={queues}
                  onSelect={selectQueue}
                  onEdit={(q) => { setEditingQueue(q); setActiveTab("create-queue"); }}
                  onDelete={deleteQueueHandler}
                />
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

            {showCreateBiz || editingBusiness ? (
              <CreateBusinessForm
                initialData={editingBusiness}
                onSubmit={(data) => {
                  if (editingBusiness) {
                    return updateBusinessHandler(editingBusiness._id, data).then(() => setEditingBusiness(null));
                  }
                  return createBusinessHandler(data).then(() => setShowCreateBiz(false));
                }}
                onCancel={() => {
                  setShowCreateBiz(false);
                  setEditingBusiness(null);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {businesses?.length > 0 ? (
                  businesses.map((biz) => (
                    <div
                      key={String(biz._id)}
                      className="group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between"
                      style={{
                        background: "#ffffff",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
                        minHeight: "240px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(58,160,255,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0, 0, 0, 0.15)";
                      }}
                    >
                      {/* Decorative Background Blob */}
                      <div
                        className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-[50px] pointer-events-none z-0 transform group-hover:scale-110"
                        style={{ background: "radial-gradient(circle, rgba(58,160,255,0.15) 0%, transparent 70%)" }}
                      />

                      {/* Header & Actions */}
                      <div className="relative z-10 flex items-start justify-between mb-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm"
                          style={{
                            background: "#eff6ff", // blue-50
                            border: "1px solid #dbeafe" // blue-100
                          }}
                        >
                          {(() => {
                            const Icon = getCategoryIcon(biz.category);
                            return <Icon size={24} style={{ color: "#3b82f6" }} />; // blue-500
                          })()}
                        </div>

                        <div className="flex gap-2 transition-all duration-300">
                          <button
                            onClick={() => setEditingBusiness(biz)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all hover:scale-110 border border-transparent hover:border-indigo-100"
                            title="Edit Business"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this business? All associated queues will also be deleted.")) {
                                deleteBusinessHandler(biz._id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110 border border-transparent hover:border-red-100"
                            title="Delete Business"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 mt-auto">
                        <div
                          className="inline-block px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold mb-4 tracking-widest transition-colors duration-300 shadow-sm"
                          style={{
                            background: "#f1f5f9", // slate-100
                            color: "#475569", // slate-600
                            border: "1px solid #e2e8f0" // slate-200
                          }}
                        >
                          {biz.category}
                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 
                            className="font-black text-2xl truncate transition-colors duration-300 group-hover:text-indigo-600"
                            style={{
                              fontFamily: "var(--font-heading)",
                              color: "#0f172a", // slate-900
                              letterSpacing: "-0.03em"
                            }}
                          >
                            {biz.name}
                          </h3>
                          {biz.isVerified && (
                            <div className="relative group/tooltip inline-block leading-none">
                              <BadgeCheck 
                                size={18} 
                                className="shrink-0 cursor-help" 
                                style={{ color: "#3AA0FF" }} 
                                fill="rgba(58,160,255,0.12)" 
                              />
                              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                                Verified Business
                                <div className="absolute top-full right-1 border-4 border-transparent border-t-slate-900" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-2.5 transition-colors duration-300" style={{ color: "#64748b" }}> {/* slate-500 */}
                            <MapPin size={15} style={{ color: "#94a3b8" }} /> {/* slate-400 */}
                            <span className="text-sm font-medium">{biz.city}</span>
                          </div>
                          {biz.openingTime && (
                            <div className="flex items-center gap-2.5 transition-colors duration-300" style={{ color: "#64748b" }}>
                              <Clock size={15} style={{ color: "#94a3b8" }} />
                              <span className="text-sm">{biz.openingTime} – {biz.closingTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
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
              onEdit={(q) => { setEditingQueue(q); setActiveTab("create-queue"); }}
              onDelete={deleteQueueHandler}
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
              initialData={editingQueue}
              onSubmit={(data) => {
                if (editingQueue) {
                  return updateQueueHandler(editingQueue._id, data).then(() => {
                    setEditingQueue(null);
                    setActiveTab("overview");
                  });
                }
                return createQueueHandler(data).then(() => setActiveTab("overview"));
              }}
              onCancel={() => {
                setEditingQueue(null);
                setActiveTab("overview");
              }}
            />
          </div>
        );

      case "settings":
        return (
          <div className="max-w-4xl mx-auto py-6 md:py-10">
            <div className="mb-10 text-center sm:text-left">
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                  fontWeight: 900,
                  color: "#F7F4EF",
                  letterSpacing: "-0.03em",
                }}
              >
                Profile <span style={{ color: "#3AA0FF" }}>Settings</span>
              </h1>
              <p
                className="mt-2"
                style={{
                  color: "rgba(247,244,239,0.45)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Manage your administrative account details and preferences.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <ProfileCard user={user} />
              </div>
              <div className="md:col-span-2 space-y-6">
                <div
                  className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md"
                >
                  <h3 className="text-xl font-bold mb-4" style={{ color: "#F7F4EF" }}>Account Security</h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Keep your operator account secure. You can update your name, phone number, and bio using the edit button on your profile card.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-sm text-slate-300">Email Verified</span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-green-500/20 text-green-400 border border-green-500/20">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-sm text-slate-300">Account Role</span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/20">{user?.role}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#E07A5F]/10 to-[#F2CC8F]/5 border border-[#E07A5F]/20"
                >
                  <h3 className="text-xl font-bold mb-4" style={{ color: "#F7F4EF" }}>Business Management</h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    As an admin, you have full control over your registered businesses and queues. Ensure your contact details are up to date so customers can reach you.
                  </p>
                </div>
              </div>
            </div>
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
          x: isDesktop ? 0 : (isSidebarOpen ? 0 : -280)
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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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

            <div className="flex items-center gap-3">
              {user?.role === "superadmin" && (
                <Link
                  to="/admin/superadmin"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-sm"
                  style={{
                    background: "rgba(129,178,154,0.1)",
                    color: "#81B29A",
                    border: "1px solid rgba(129,178,154,0.2)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  <Building2 size={16} />
                  <span className="hidden sm:inline">Super Admin Panel</span>
                </Link>
              )}

              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-sm"
                style={{
                  background: "rgba(58,160,255,0.1)",
                  color: "#3AA0FF",
                  border: "1px solid rgba(58,160,255,0.2)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                <Home size={16} />
                <span className="hidden sm:inline">Go to Home</span>
              </Link>
            </div>
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
