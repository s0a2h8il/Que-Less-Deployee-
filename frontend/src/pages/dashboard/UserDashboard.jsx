import React from "react";
import { motion } from "framer-motion";
import { useUserDashboard } from "../../hooks/useUserDashboard";
import ProfileCard from "../../components/dashboard/user/ProfileCard";
import DashboardStats from "../../components/dashboard/user/DashboardStats";
import MyActiveQueues from "../../components/dashboard/user/MyActiveQueues";
import NotificationList from "../../components/dashboard/user/NotificationList";
import ExchangeSpotCard from "../../components/dashboard/user/ExchangeSpotCard";
import { Loader } from "../../components";
import { RefreshCcw, AlertTriangle } from "lucide-react";

const UserDashboard = () => {
  const { user, activeQueues, notifications, stats, loading, error, refetch } =
    useUserDashboard();

  if (loading) return <Loader fullPage message="Loading your cockpit..." />;

  if (error) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
        style={{ background: "var(--bg)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: "rgba(234,82,111,0.10)" }}
        >
          <AlertTriangle size={32} style={{ color: "#EA526F" }} />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
          Dashboard Error
        </h2>
        <p className="mb-7" style={{ color: "var(--text-muted)" }}>{error}</p>
        <button
          onClick={refetch}
          className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: "#3AA0FF", color: "#0B1320", fontFamily: "var(--font-heading)" }}
        >
          <RefreshCcw size={15} className="group-hover:rotate-180 transition-transform duration-500" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 py-10" style={{ background: "var(--bg)" }}>
      {/* ── Page header ───────────────────────────────── */}
      <div
        className="relative overflow-hidden mb-10"
        style={{ background: "var(--night-ink)", paddingTop: "2.5rem", paddingBottom: "3.5rem" }}
      >
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "-30%", left: "-5%",  width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,160,255,0.10) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-40%", right: "5%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,179,61,0.08) 0%, transparent 70%)" }} />
        </div>
        <div className="container mx-auto px-6 relative">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(58,160,255,0.80)", fontFamily: "var(--font-body)" }}>
              Personal Cockpit
            </p>
            <h1
              className="text-4xl font-black"
              style={{ fontFamily: "var(--font-heading)", color: "#F7F4EF", letterSpacing: "-0.025em" }}
            >
              Welcome back,{" "}
              <span style={{ color: "#3AA0FF" }}>{user?.name?.split(" ")[0]}!</span>
            </h1>
            <p className="mt-2" style={{ color: "rgba(247,244,239,0.45)", fontFamily: "var(--font-body)" }}>
              Manage your active spots and notifications here.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Grid Layout ──────────────────────────────── */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard user={user} />
            <ExchangeSpotCard />
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-7">
            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">
              {/* Active queues */}
              <div className="xl:col-span-2 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                    My Active Queues
                  </h3>
                  <button
                    onClick={refetch}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ border: "1px solid var(--border-strong)", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#3AA0FF"; e.currentTarget.style.color = "#3AA0FF"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    <RefreshCcw size={12} />
                    Refresh
                  </button>
                </div>
                <MyActiveQueues queues={activeQueues} />
              </div>

              {/* Notifications */}
              <div className="xl:col-span-1 space-y-5">
                <h3 className="text-xl font-black" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                  Notifications
                </h3>
                <NotificationList notifications={notifications} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
