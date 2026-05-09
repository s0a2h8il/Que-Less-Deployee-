import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Zap, ShieldCheck, ArrowRight, TrendingUp, History, PlusCircle, BarChart3 } from "lucide-react";
import { queueApi } from "../../api/queueApi";
import { analyticsApi } from "../../api/analyticsApi";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useQueueSocket } from "../../hooks/useQueueSocket";

const palette = {
  peach: "#E07A5F",
  mint: "#81B29A",
  ink: "#3D405B",
};

const EmptyQueueCard = ({ title, message }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.72)",
      border: "1px solid rgba(61,64,91,0.14)",
      borderRadius: "2rem",
      overflow: "hidden",
      boxShadow: "0 24px 54px rgba(61,64,91,0.14)",
      backdropFilter: "blur(16px)",
      padding: "3rem",
      textAlign: "center",
      minHeight: "420px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        margin: "0 auto 1.5rem",
        borderRadius: 22,
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
        color: "#fff",
        fontSize: "2rem",
        boxShadow: "0 14px 32px rgba(224,122,95,0.28)",
      }}
    >
      🎫
    </div>
    <h3
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: "1.6rem",
        fontWeight: 800,
        color: palette.ink,
        marginBottom: "0.75rem",
      }}
    >
      {title}
    </h3>
    <p
      style={{
        fontFamily: "var(--font-body)",
        color: "rgba(61,64,91,0.68)",
        fontSize: "1.1rem",
        lineHeight: 1.6,
      }}
    >
      {message}
    </p>
  </div>
);

const AdminQuickActionsCard = ({ stats }) => (
  <div
    className="relative overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.92)",
      border: "1px solid rgba(61,64,91,0.18)",
      borderRadius: "2.5rem",
      boxShadow: "0 40px 100px -20px rgba(61,64,91,0.2)",
      backdropFilter: "blur(24px)",
      padding: "2.5rem",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--mint-soft)]/10 blur-[80px] rounded-full" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--amber-pulse)]/10 blur-[100px] rounded-full" />

    <div className="relative z-10 flex items-center justify-between mb-10">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-[var(--night-ink)] text-white shadow-2xl rotate-2">
          <ShieldCheck size={26} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight leading-none mb-1.5" style={{ color: palette.ink }}>Control Center</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-[var(--night-ink)]/5 rounded text-[var(--night-ink)]/60">Authorized Access</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint-soft)] animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex -space-x-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-9 w-9 rounded-full border-[3px] border-white bg-slate-100 flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-black text-slate-400">U{i}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="p-6 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Active Queues</p>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black" style={{ color: palette.ink }}>{stats.activeQueues}</span>
          <div className="h-8 w-[1px] bg-slate-200" />
          <span className="text-xs font-bold text-[var(--mint-soft)]">Live</span>
        </div>
      </div>
      <div className="p-6 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Total People</p>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black" style={{ color: palette.ink }}>{stats.totalPeople}</span>
          <div className="h-8 w-[1px] bg-slate-200" />
          <Users size={16} className="text-slate-300" />
        </div>
      </div>
      <div className="p-6 rounded-[2rem] bg-[var(--night-ink)] text-white shadow-xl">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Today's Pulse</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-black tracking-tight">
            {stats.pulse >= 0 ? "+" : ""}{stats.pulse || 0}%
          </span>
          <TrendingUp size={18} className={stats.pulse >= 0 ? "text-[var(--mint-soft)]" : "text-[var(--peach-soft)]"} />
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${Math.min(Math.max(stats.pulse || 0, 10), 100)}%` }} 
            transition={{ duration: 1.5 }} 
            className="h-full bg-[var(--mint-soft)]" 
          />
        </div>
      </div>
    </div>

    <div className="relative z-10 flex flex-col md:flex-row gap-6">
      <Link to="/admin/dashboard" className="flex-[1.5] group">
        <div className="h-full flex flex-col justify-between p-7 rounded-[2rem] bg-gradient-to-br from-[var(--night-ink)] to-[var(--slate-core)] text-white transition-all shadow-2xl group-hover:shadow-[var(--night-ink)]/30 group-hover:-translate-y-1 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex items-start justify-between mb-8">
            <div className="p-3 rounded-2xl bg-white/10 shadow-inner">
              <Zap size={24} className="text-[var(--amber-pulse)] fill-[var(--amber-pulse)]/20" />
            </div>
            <ArrowRight size={22} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter block mb-1">Launch Dashboard</span>
            <p className="text-xs font-bold opacity-60">Full business analytics & queue control</p>
          </div>
        </div>
      </Link>
      <div className="flex-1 grid grid-cols-1 gap-4">
        <Link to="/admin/dashboard?tab=create-queue" className="group h-full">
          <div className="h-full flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/5 hover:border-[var(--mint-soft)]/30 transition-all shadow-sm hover:shadow-md">
            <div className="p-3 rounded-xl bg-[var(--mint-soft)]/10 text-[var(--mint-soft)]">
              <PlusCircle size={24} />
            </div>
            <span className="text-sm font-black tracking-tight" style={{ color: palette.ink }}>Create Queue</span>
          </div>
        </Link>
        <Link to="/analytics" className="group h-full">
          <div className="h-full flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/5 hover:border-[var(--signal-blue)]/30 transition-all shadow-sm hover:shadow-md">
            <div className="p-3 rounded-xl bg-[var(--signal-blue)]/10 text-[var(--signal-blue)]">
              <BarChart3 size={24} />
            </div>
            <span className="text-sm font-black tracking-tight" style={{ color: palette.ink }}>Queue Reports</span>
          </div>
        </Link>
      </div>
    </div>

    <div className="relative z-10 mt-10 pt-6 border-t border-black/5 flex items-center justify-between text-slate-400">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--mint-soft)] animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Real-time Sync Active</span>
      </div>
      <span className="text-[10px] font-bold">Node_Sync_8080.v2</span>
    </div>
  </div>
);

const AnimatedQueuePreview = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const [loading, setLoading] = useState(true);
  const [hasRealData, setHasRealData] = useState(false);
  const [currentToken, setCurrentToken] = useState(null);
  const [waitTime, setWaitTime] = useState(null);
  const [aheadCount, setAheadCount] = useState(null);
  const [members, setMembers] = useState([]);
  const [adminStats, setAdminStats] = useState({ activeQueues: 0, totalPeople: 0, pulse: 0 });

  useEffect(() => {
    let cancelled = false;

    const resolveQueueData = async () => {
      try {
        if (isAdmin) {
          const allQueues = await queueApi.getAll().catch(() => ({ data: [] }));
          const queues = allQueues?.data || allQueues || [];
          
          // Fetch pulse/analytics
          const response = await analyticsApi.getOverviewAnalytics().catch(() => null);
          const analytics = response?.data || response;
          const growthRate = analytics?.userStats?.completionRate || 0;

          if (!cancelled) {
            setAdminStats({
              activeQueues: queues.length,
              totalPeople: queues.reduce((acc, q) => acc + (q.members?.length || 0), 0),
              pulse: growthRate
            });
          }
        }

        const activeQueueResponse = isAuthenticated
          ? await queueApi.getMyActive().catch(() => null)
          : null;

        let queueData = activeQueueResponse?.data ?? activeQueueResponse ?? null;
        let queueId = null;

        if (Array.isArray(queueData) && queueData.length > 0) {
          queueId = queueData[0]._id;
        }

        if (!queueId && isAuthenticated) {
          const allQueuesResponse = await queueApi.getAll().catch(() => null);
          let allQueues = allQueuesResponse?.data ?? allQueuesResponse ?? [];
          if (!Array.isArray(allQueues)) allQueues = [];

          const found = allQueues.find((item) =>
            Array.isArray(item.members)
              ? item.members.some((member) => member.userId === user?._id && member.status !== "left" && member.status !== "cancelled")
              : false,
          );
          queueId = found?._id;
        }

        let queue = null;
        if (queueId) {
          const fullDetailRes = await queueApi.getQueueById(queueId).catch(() => null);
          queue = fullDetailRes?.data?.queue || fullDetailRes?.data;
        }

        if (cancelled) return;

        if (!queue || !Array.isArray(queue.members)) {
          setHasRealData(false);
          setMembers([]);
          return;
        }

        // Filter out members who have left or cancelled
        const validMembers = queue.members.filter(m => m.status !== "left" && m.status !== "cancelled");
        if (validMembers.length === 0) {
          setHasRealData(false);
          setMembers([]);
          return;
        }

        const sortedMembers = [...validMembers].sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
        const userMember = sortedMembers.find((m) => m.userId === user?._id);
        const activeToken = queue.currentToken || sortedMembers[0]?.tokenNumber || 0;
        const userToken = userMember?.tokenNumber || null;
        const membersAhead = userToken ? sortedMembers.filter(m => m.tokenNumber < userToken && m.status !== "completed").length : 0;
        const estimatedMinutes = membersAhead * (queue.estimatedTimePerUser || 5);

        // Ensure "You" only appears once for the current user's entry
        const previewMembers = sortedMembers.slice(0, 3).map((m, i) => {
          const mid = m.userId?._id || m.userId || i;
          return {
            id: String(mid),
            token: m.tokenNumber,
            label: m.userId === user?._id && m.tokenNumber === userToken ? "You" : (m.name || `Token ${m.tokenNumber}`),
            status: m.status === "called" ? "Called" : m.status === "completed" ? "Completed" : "Waiting",
            active: m.status === "called"
          };
        });

        if (!cancelled) {
          setCurrentToken(activeToken);
          setWaitTime(estimatedMinutes > 0 ? `~${estimatedMinutes}m` : "Your turn");
          setAheadCount(membersAhead);
          setMembers(previewMembers);
          setHasRealData(true);
        }
      } catch (error) {
        console.error("Queue preview error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    resolveQueueData();
    return () => { cancelled = true; };
  }, [isAuthenticated, user?._id, isAdmin]);

  // Real-time updates for Animated Preview
  const activeQueueIdsForSocket = hasRealData && members.length > 0 ? [members[0]?.queueId || members[0]?._id].filter(Boolean) : [];
  
  useQueueSocket(
    activeQueueIdsForSocket,
    () => {
      // Refresh data silently when socket notifies an update
      const refresh = async () => {
        try {
          const activeQueueResponse = isAuthenticated ? await queueApi.getMyActive().catch(() => null) : null;
          let queueData = activeQueueResponse?.data ?? activeQueueResponse ?? null;
          
          if (Array.isArray(queueData) && queueData.length > 0) {
            const fullDetailRes = await queueApi.getQueueById(queueData[0]._id).catch(() => null);
            const queue = fullDetailRes?.data?.queue || fullDetailRes?.data;
            if (queue) {
               // Update local state with fresh data
               const validMembers = queue.members.filter(m => m.status !== "left" && m.status !== "cancelled");
               const sortedMembers = [...validMembers].sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
               const userMember = sortedMembers.find((m) => m.userId === user?._id);
               const activeToken = queue.currentToken || sortedMembers[0]?.tokenNumber || 0;
               const userToken = userMember?.tokenNumber || null;
               const membersAhead = userToken ? sortedMembers.filter(m => m.tokenNumber < userToken && m.status !== "completed").length : 0;
               const estimatedMinutes = membersAhead * (queue.estimatedTimePerUser || 5);
               
               setCurrentToken(activeToken);
               setWaitTime(estimatedMinutes > 0 ? `~${estimatedMinutes}m` : "Your turn");
               setAheadCount(membersAhead);
                setMembers(sortedMembers.slice(0, 3).map((m, i) => {
                  const mid = m.userId?._id || m.userId || i;
                  return {
                    id: String(mid),
                    token: m.tokenNumber,
                    label: m.userId === user?._id && m.tokenNumber === userToken ? "You" : (m.name || `Token ${m.tokenNumber}`),
                    status: m.status === "called" ? "Called" : m.status === "completed" ? "Completed" : "Waiting",
                    active: m.status === "called"
                  };
                }));
            }
          }
        } catch (e) { console.error("Socket refresh error:", e); }
      };
      refresh();
    }
  );

  if (loading) {
    return (
      <div className="relative mx-auto" style={{ maxWidth: 580 }}>
        <EmptyQueueCard title="Loading Control Center" message="Synchronizing with live queue systems..." />
      </div>
    );
  }

  if (!hasRealData) {
    return (
      <div className="relative mx-auto" style={{ maxWidth: 580 }}>
        {isAdmin ? <AdminQuickActionsCard stats={adminStats} /> : <EmptyQueueCard title="No live queue data" message="Join a queue to see your position, wait time, and nearby customers here." />}
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Floating Badges - Centered exactly on the corners for a "proper" look */}
      <motion.div 
        animate={{ y: [0, -12, 0] }} 
        transition={{ duration: 4, repeat: Infinity }} 
        style={{ 
          background: "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)", 
          fontFamily: "var(--font-heading)" 
        }}
        className="absolute z-20 flex h-14 w-14 sm:h-16 sm:w-16 flex-col items-center justify-center rounded-full text-white shadow-xl bottom-0 left-0 sm:-bottom-6 sm:-left-6"
      >
        <div className="text-lg sm:text-xl font-black">{aheadCount + 1}</div>
        <div className="text-[7px] sm:text-[8px] font-black uppercase">Pos</div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 5, repeat: Infinity }} 
        className="absolute z-20 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full text-white shadow-2xl top-0 right-0 sm:-top-12 sm:-right-4" 
        style={{ 
          background: "linear-gradient(135deg, #3D405B 0%, #81B29A 100%)",
          paddingBottom: "4px" 
        }}
      >
        <div className="text-center flex flex-col items-center justify-center">
          <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-60 -mb-1">Serving</div>
          <div className="text-2xl sm:text-4xl font-black leading-none" style={{ fontFamily: "var(--font-heading)" }}>#{currentToken}</div>
        </div>
      </motion.div>

      <div 
        className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden"
        style={{ 
          background: "rgba(255,255,255,0.94)", 
          border: "1px solid rgba(61,64,91,0.18)", 
          boxShadow: "0 30px 80px rgba(61,64,91,0.16)", 
          backdropFilter: "blur(24px)" 
        }} 
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 sm:p-10" style={{ background: "linear-gradient(135deg, rgba(129,178,154,0.12) 0%, rgba(190,227,248,0.20) 100%)" }}>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] mb-4 sm:mb-8 bg-white/80 border border-black/5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[var(--mint-soft)]" />
              Live Tracking
            </div>
            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-2 sm:mb-3" style={{ color: palette.ink, fontFamily: "var(--font-heading)" }}>Assigned Token</h4>
            <div className="text-5xl sm:text-7xl font-black" style={{ fontFamily: "var(--font-heading)", color: palette.ink, letterSpacing: "-0.05em", lineHeight: 0.9 }}>
              #{members.find(m => m.label === "You")?.token || "-"}
            </div>
          </div>

          <div className="flex-1 p-6 sm:p-8 md:border-l border-black/5 flex flex-col justify-center">
            {[
              { Icon: Clock, label: "Wait Time", value: waitTime, color: palette.peach },
              { Icon: Users, label: "People Ahead", value: `${aheadCount} users`, color: palette.mint },
            ].map(({ Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-5 p-5 rounded-2xl bg-white/60 border border-white shadow-sm mb-4 last:mb-0">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-400">
                  <Icon size={22} style={{ color }} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</p>
                  <p className="text-xl font-black" style={{ color: palette.ink }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-black/5 bg-white/40">
          <div className="flex items-center gap-3 mb-6">
            <History size={16} className="text-slate-300" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Recent Activity Flow</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {members.map((m, i) => (
              <motion.div key={`member-${m.id}-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center justify-center p-4 rounded-2xl border bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black" style={{ color: m.active ? palette.mint : palette.ink }}>#{m.token}</span>
                  <span className="text-xs font-bold opacity-70">{m.label}</span>
                </div>
                <div className={`h-2 w-2 rounded-full ${m.active ? 'bg-[var(--mint-soft)] animate-pulse' : 'bg-slate-200'} ml-2`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedQueuePreview;
