import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, FileText } from "lucide-react";
import { useSuperAdminDashboard } from "../../hooks/useSuperAdminDashboard";
import SuperAdminSidebar from "../../components/dashboard/superadmin/SuperAdminSidebar";
import SuperAdminStats from "../../components/dashboard/superadmin/SuperAdminStats";
import UsersTable from "../../components/dashboard/superadmin/UsersTable";
import BusinessesTable from "../../components/dashboard/superadmin/BusinessesTable";
import QueuesTable from "../../components/dashboard/superadmin/QueuesTable";
import { Loader } from "../../components";
import { Toast } from "../../components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

const SuperAdminDashboard = () => {
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

  const showMobileOverlay = !isDesktop && isSidebarOpen;
  const handleNavigate = () => {
    if (!isDesktop) setIsSidebarOpen(false);
  };
  const {
    stats,
    users,
    businesses,
    queues,
    loading,
    error,
    activeTab,
    setActiveTab,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleVerifyBusiness,
    handleUnverifyBusiness,
    handleDeleteBusiness,
    handleDeleteQueue,
    toast,
    hideToast,
  } = useSuperAdminDashboard();

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div>
              <h1 
                className="text-3xl md:text-4xl"
                style={{ 
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  color: "#F7F4EF"
                }}
              >
                Platform Overview
              </h1>
              <p 
                style={{ 
                  color: "rgba(247,244,239,0.7)",
                  marginTop: "0.5rem",
                  fontWeight: 500
                }}
              >
                Real-time platform-wide insights and system health
              </p>
            </div>
            <SuperAdminStats stats={stats} loading={loading} />
          </div>
        );

      case "users":
        return (
          <div className="space-y-8">
            <div>
              <h1 
                className="text-3xl md:text-4xl"
                style={{ 
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  color: "#F7F4EF"
                }}
              >
                Identity Management
              </h1>
              <p 
                style={{ 
                  color: "rgba(247,244,239,0.7)",
                  marginTop: "0.5rem",
                  fontWeight: 500
                }}
              >
                Oversight and control of all registered platform users
              </p>
            </div>
            <UsersTable
              users={users}
              loading={loading}
              filters={filters}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
            />
          </div>
        );

      case "businesses":
        return (
          <div className="space-y-8">
            <div>
              <h1 
                className="text-3xl md:text-4xl"
                style={{ 
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  color: "#F7F4EF"
                }}
              >
                Business Governance
              </h1>
              <p 
                style={{ 
                  color: "rgba(247,244,239,0.7)",
                  marginTop: "0.5rem",
                  fontWeight: 500
                }}
              >
                Verify organizations and manage platform ecosystem
              </p>
            </div>
            <BusinessesTable
              businesses={businesses}
              loading={loading}
              filters={filters}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onVerify={handleVerifyBusiness}
              onUnverify={handleUnverifyBusiness}
              onDelete={handleDeleteBusiness}
            />
          </div>
        );

      case "queues":
        return (
          <div className="space-y-8">
            <div>
              <h1 
                className="text-3xl md:text-4xl"
                style={{ 
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  color: "#F7F4EF"
                }}
              >
                Queue Surveillance
              </h1>
              <p 
                style={{ 
                  color: "rgba(247,244,239,0.7)",
                  marginTop: "0.5rem",
                  fontWeight: 500
                }}
              >
                Monitor live traffic and active virtual queues
              </p>
            </div>
            <QueuesTable
              queues={queues}
              loading={loading}
              filters={filters}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onDelete={handleDeleteQueue}
            />
          </div>
        );

      case "logs":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Audit Trail
              </h1>
              <p className="text-slate-400 mt-2 font-medium">
                Comprehensive security and activity logs
              </p>
            </div>
            <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-20 text-center backdrop-blur-md">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-slate-500" size={32} />
                </div>
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: "#F7F4EF" }}
                >
                  Immutable Logs
                </h3>
                <p style={{ color: "rgba(247,244,239,0.7)" }}>
                  Activity logging system is currently being provisioned. This feature will be available in the next security patch.
                </p>
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
          width: isDesktop ? 256 : 256,
          x: isDesktop ? 0 : (isSidebarOpen ? 0 : -280)
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <SuperAdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigate={handleNavigate}
        />
      </motion.aside>

      <motion.main
        className="flex-1 min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        animate={{ marginLeft: isDesktop ? 256 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm lg:hidden"
              style={{
                background: isSidebarOpen ? "rgba(247,244,239,0.06)" : "rgba(58,160,255,0.12)",
                border: isSidebarOpen ? "1px solid rgba(247,244,239,0.12)" : "1px solid rgba(58,160,255,0.30)",
                color: isSidebarOpen ? "rgba(247,244,239,0.60)" : "#3AA0FF",
                fontFamily: "var(--font-heading)",
              }}
            >
              Menu
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-sm ml-auto lg:ml-0"
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

            <span 
              className="text-[10px] uppercase tracking-widest font-bold ml-auto lg:hidden"
              style={{ color: "rgba(247,244,239,0.4)" }}
            >
              Super Admin
            </span>
          </div>

          {error && (
            <div
              className="mb-6 p-4 rounded-2xl flex justify-between items-center"
              style={{
                background: "rgba(234,82,111,0.10)",
                border: "1px solid rgba(234,82,111,0.25)",
                color: "#EA526F"
              }}
            >
              <p>{error}</p>
              <button
                onClick={refetch}
                className="text-sm font-semibold px-3 py-1 rounded-lg"
                style={{ background: "rgba(234,82,111,0.15)" }}
              >
                Retry
              </button>
            </div>
          )}

          {loading && (!stats || (!users.length && !businesses.length && !queues.length)) ? (
            <div className="flex h-[60vh] items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : (
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
          )}
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

export default SuperAdminDashboard;
