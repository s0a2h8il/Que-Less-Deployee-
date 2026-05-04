import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, BellRing } from "lucide-react";

// Illustrative demo widget — showcases the live queue experience.
const AnimatedQueuePreview = () => {
  const members = [
    { id: 1, token: 12, label: "You",      status: "Called",  active: true  },
    { id: 2, token: 13, label: "Token 13", status: "Waiting", active: false },
    { id: 3, token: 14, label: "Token 14", status: "Waiting", active: false },
  ];

  return (
    <div className="relative mx-auto" style={{ maxWidth: 390, overflow: "visible" }}>
      {/* Floating badge — top right */}
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-20 flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{
          top: "-1.8rem",
          right: "-1rem",
          background: "#F2B33D",
          boxShadow: "0 8px 24px rgba(242,179,61,0.50)",
          fontFamily: "var(--font-heading)",
          fontSize: "1.15rem",
          fontWeight: 800,
        }}
      >
        15
      </motion.div>

      {/* Floating badge — bottom left */}
      <motion.div
        animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute z-20 flex h-20 w-20 items-center justify-center rounded-full text-white"
        style={{
          bottom: "-1.5rem",
          left: "-2rem",
          background: "linear-gradient(135deg, #3AA0FF 0%, #2888e8 100%)",
          boxShadow: "0 8px 28px rgba(58,160,255,0.50)",
        }}
      >
        <div className="text-center">
          <div className="text-[10px] font-medium" style={{ color: "rgba(247,244,239,0.70)" }}>Token</div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 900, lineHeight: 1, color: "#F7F4EF" }}>12</div>
        </div>
      </motion.div>

      {/* Main Card */}
      <div
        style={{
          background: "rgba(31,41,55,0.95)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(11,19,32,0.55)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Card header */}
        <div
          style={{
            background: "linear-gradient(135deg, #3AA0FF 0%, #2888e8 100%)",
            padding: "1.5rem",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(247,244,239,0.20)", color: "#F7F4EF", backdropFilter: "blur(8px)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Live Queue
            </div>
            <BellRing size={17} style={{ color: "rgba(247,244,239,0.80)" }} />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium" style={{ color: "rgba(247,244,239,0.70)", fontFamily: "var(--font-body)" }}>
              Virtual Queue Demo
            </h4>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 900, color: "#F7F4EF", marginTop: 8, letterSpacing: "-0.03em" }}>
              Token 12
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "1.5rem" }}>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { Icon: Clock,  label: "Wait Time", value: "~10m" },
              { Icon: Users,  label: "Ahead",     value: "2 users" },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl p-4 text-center"
                style={{ background: "rgba(247,244,239,0.05)", border: "1px solid rgba(247,244,239,0.08)" }}
              >
                <Icon size={18} className="mx-auto mb-2" style={{ color: "#3AA0FF" }} />
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(247,244,239,0.40)" }}>{label}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.05rem", color: "#F7F4EF" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Members list */}
          <div className="space-y-2.5">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-between rounded-xl border p-3"
                style={{
                  background: member.active ? "rgba(58,160,255,0.10)" : "rgba(247,244,239,0.03)",
                  border: member.active ? "1px solid rgba(58,160,255,0.28)" : "1px solid rgba(247,244,239,0.07)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                    style={{
                      background: member.active ? "#3AA0FF" : "rgba(247,244,239,0.08)",
                      color: member.active ? "#0B1320" : "rgba(247,244,239,0.45)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {member.token}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: member.active ? "#F7F4EF" : "rgba(247,244,239,0.55)", fontFamily: "var(--font-body)" }}>
                    {member.label}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: member.active ? "#3AA0FF" : "rgba(247,244,239,0.30)" }}
                >
                  {member.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedQueuePreview;
