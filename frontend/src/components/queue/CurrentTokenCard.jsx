import React from "react";
import { motion } from "framer-motion";
import { Hash, Activity } from "lucide-react";
import { Card } from "../ui/Card";

const CurrentTokenCard = ({ queue }) => {
  const { currentToken } = queue;

  return (
    <Card className="relative overflow-hidden p-8 h-full min-h-[380px] flex flex-col justify-center transition-all hover:shadow-2xl">
      <div
        className="absolute -top-24 -right-20 h-64 w-64 rounded-full blur-[100px] opacity-40 pointer-events-none"
        style={{
          background: "var(--signal-blue)",
        }}
      />
      <div
        className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full blur-[100px] opacity-30 pointer-events-none"
        style={{
          background: "var(--mint-soft)",
        }}
      />

      <div className="absolute top-6 right-6">
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm"
          style={{
            background: "rgba(129,178,154,0.12)",
            color: "var(--accent-3)",
            border: "1px solid rgba(129,178,154,0.25)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#81B29A] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em]">
            Live Now
          </span>
        </div>
      </div>

      <div className="relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-16 w-16 rounded-3xl flex items-center justify-center mb-8 shadow-inner"
          style={{
            background: "rgba(190,227,248,0.25)",
            color: "var(--primary)",
            border: "1.5px solid rgba(190,227,248,0.5)",
          }}
        >
          <Hash size={32} strokeWidth={2.5} />
        </motion.div>
        
        <h4
          className="text-[12px] font-black uppercase tracking-[0.25em] mb-4 opacity-60"
          style={{ color: "var(--text-primary)" }}
        >
          Now Serving
        </h4>
        
        <div className="relative">
          <motion.div
            key={currentToken}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-8xl font-black tracking-tighter"
            style={{ 
              color: "var(--text-primary)",
              textShadow: "0 10px 30px rgba(61,64,91,0.08)"
            }}
          >
            {currentToken || "0"}
          </motion.div>
        </div>

        <p
          className="mt-8 font-semibold text-sm max-w-[240px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Token <span className="text-[var(--primary)] font-black">{currentToken || 0}</span> is currently at the front of the line.
        </p>
      </div>
    </Card>
  );
};

export default CurrentTokenCard;
