import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Hourglass, TrendingDown, Clock, Users, Zap, History } from "lucide-react";
import { Card } from "../ui/Card";

const palette = {
  peach: "#E07A5F",
  mint: "#81B29A",
  ink: "#3D405B",
};

const UserPositionCard = ({ userMember, queue }) => {
  const isInactive = !userMember || (userMember.status !== "waiting" && userMember.status !== "called");

  if (isInactive) {
    return (
      <Card
        className="p-8 h-full min-h-[420px] border-2 flex flex-col items-center justify-center text-center transition-all relative overflow-hidden"
        style={{
          borderColor: "rgba(61,64,91,0.08)",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(16px)",
          borderRadius: "2.5rem",
          boxShadow: "0 24px 54px rgba(61,64,91,0.08)",
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--peach-soft)]/10 blur-[60px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--mint-soft)]/10 blur-[60px] rounded-full" />
        
        <div className="relative z-10">
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
          <h4 className="text-2xl font-black mb-3 tracking-tight" style={{ color: palette.ink }}>Your Spot</h4>
          <p className="text-sm max-w-[240px] mx-auto leading-relaxed" style={{ color: "rgba(61,64,91,0.6)" }}>
            Join this queue to receive your unique token and track your live position in real-time.
          </p>
        </div>
      </Card>
    );
  }

  const { tokenNumber, status } = userMember;
  const { currentToken, estimatedTimePerUser, members } = queue;
  const isCalled = status === "called";

  const aheadCount =
    members?.filter(
      (m) => m.status === "waiting" && m.tokenNumber < tokenNumber,
    ).length || 0;
  const waitTime = aheadCount * (estimatedTimePerUser || 5);

  return (
    <Card
      className="h-full min-h-[420px] transition-all relative overflow-hidden flex flex-col"
      style={{
        background: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(61,64,91,0.18)",
        borderRadius: "2.5rem",
        boxShadow: "0 30px 80px rgba(61,64,91,0.16)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Section - Token Display (Centered like the "Other" card) */}
        <div 
          className="flex-1 flex flex-col items-center justify-center text-center p-8 pt-12 md:pt-8"
          style={{ 
            background: isCalled 
              ? "linear-gradient(135deg, #3D405B 0%, #4F5D75 100%)" 
              : "linear-gradient(135deg, rgba(129,178,154,0.12) 0%, rgba(190,227,248,0.20) 100%)",
            color: isCalled ? "white" : palette.ink
          }}
        >
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] mb-8 shadow-sm border ${isCalled ? 'bg-white/10 border-white/20' : 'bg-white/80 border-black/5'}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isCalled ? 'bg-[var(--mint-soft)]' : 'bg-[var(--mint-soft)]'}`} />
            {isCalled ? "Active Now" : "Live Tracking"}
          </div>
          
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Assigned Token</h4>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "4.5rem", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.9 }}>
            #{tokenNumber}
          </div>
          
          {isCalled && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-xs font-bold opacity-80"
            >
              Please proceed to the counter!
            </motion.p>
          )}
        </div>
        
        {/* Right Section - Stats (Grid Blocks like the "Other" card) */}
        <div className="flex-1 p-8 md:border-l border-black/5 flex flex-col justify-center bg-white/40">
           {!isCalled ? (
             <div className="space-y-4">
              {[
                { Icon: Clock, label: "Wait Time", value: `${waitTime}m`, color: palette.peach },
                { Icon: Users, label: "People Ahead", value: `${aheadCount} users`, color: palette.mint },
              ].map(({ Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 shrink-0">
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40 mb-0.5">{label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black tracking-tight" style={{ color: palette.ink }}>
                          {label === "Wait Time" ? waitTime : aheadCount}
                        </span>
                        <span className="text-[10px] font-bold uppercase opacity-40">
                          {label === "Wait Time" ? "m" : (aheadCount === 1 ? "user" : "users")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           ) : (
             <div className="text-center p-8 rounded-[2.5rem] bg-white border border-black/5 shadow-sm">
                <Zap size={32} className="mx-auto mb-4 text-[var(--amber-pulse)] fill-[var(--amber-pulse)]/20" />
                <p className="text-lg font-black" style={{ color: palette.ink }}>Live Active</p>
                <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1 font-black">Counter Notification Sent</p>
             </div>
           )}
        </div>
      </div>
    </Card>
  );
};

export default UserPositionCard;
