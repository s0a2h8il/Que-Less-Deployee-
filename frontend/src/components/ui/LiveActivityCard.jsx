import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

/**
 * LiveActivityCard - A premium UI component featuring a smooth radar-like pulse animation.
 * Now enhanced to display queue information.
 */
const LiveActivityCard = ({ queue }) => {
  const currentToken = queue?.currentToken || 0;

  // Configurable ring variants to create staggered, varied motion
  const rings = [
    { delay: 0, scale: [0.8, 2.2], opacity: [0, 0.6, 0], color: "#81B29A" },
    { delay: 1, scale: [0.8, 2.2], opacity: [0, 0.4, 0], color: "#3AA0FF" },
    { delay: 2, scale: [0.8, 2.2], opacity: [0, 0.5, 0], color: "#F2CC8F" },
    { delay: 3, scale: [0.8, 2.2], opacity: [0, 0.3, 0], color: "#81B29A" },
  ];

  return (
    <div className="relative w-full h-full min-h-[380px] bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-xl border border-white/50 overflow-hidden group flex flex-col justify-between">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-[#81B29A]/10 via-transparent to-[#3AA0FF]/10 blur-[80px] pointer-events-none rounded-full" />

      {/* Header: Live Indicator + Heading */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-[#81B29A] p-2 bg-[#81B29A]/10 rounded-xl">
            <Activity size={20} className="animate-pulse" />
          </div>
          <h2 className="text-lg font-black text-[var(--night-ink)] tracking-tight uppercase">
            Live Status
          </h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#81B29A]/15 border border-[#81B29A]/30 text-[#81B29A] text-[9px] font-black uppercase tracking-widest">
          Active
        </div>
      </div>

      {/* Pulse Core: Animated rings and center circle */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Subtle central radial shadow */}
        <div className="absolute w-24 h-24 bg-[var(--night-ink)]/[0.03] blur-2xl rounded-full" />

        {/* Animated Rings expanding outward */}
        {rings.map((ring, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border shadow-inner pointer-events-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: ring.scale,
              opacity: ring.opacity,
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: ring.delay,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              width: "100px",
              height: "100px",
              borderColor: `${ring.color}44`,
              borderWidth: "1.5px",
            }}
          />
        ))}

        {/* Solid Center Circle with breathing effect and Token Number */}
        <motion.div
          className="relative w-24 h-24 bg-white rounded-full z-20 shadow-2xl flex flex-col items-center justify-center border border-[var(--border)]"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 10px 30px rgba(61, 64, 91, 0.12)",
              "0 15px 45px rgba(61, 64, 91, 0.18)",
              "0 10px 30px rgba(61, 64, 91, 0.12)",
            ],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
           <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-70">Serving</span>
           <span className="text-4xl font-black text-[var(--night-ink)] tracking-tighter leading-none">{currentToken}</span>
        </motion.div>
      </div>

      {/* Status Text with gentle fade */}
      <div className="relative z-10 text-center mt-6">
        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-[var(--night-ink)] font-bold text-sm tracking-wide opacity-70"
        >
          {currentToken > 0 ? `Token ${currentToken} is being served` : "Starting soon..."}
        </motion.p>
      </div>

      {/* Bottom micro-light effect on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#81B29A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default LiveActivityCard;
