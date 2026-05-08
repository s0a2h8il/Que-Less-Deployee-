import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Zap, CheckCircle, Info } from "lucide-react";
import { Card } from "../ui/Card";

const QueueLiveTimeline = ({ events }) => {
  return (
    <Card className="p-8 h-full min-h-[320px] flex flex-col relative overflow-hidden">
      <div
        className="absolute -top-12 -left-10 h-32 w-32 rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(129,178,154,0.55) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Radio
              size={20}
              className="animate-pulse"
              style={{ color: "#81B29A" }}
            />
            <h4
              className="text-lg font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Live Activity
            </h4>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
          <AnimatePresence initial={false}>
            {events.length > 0 ? (
              events.map((event, i) => (
                <motion.div
                  key={event.id || i}
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-4 group"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                      style={getEventStyles(event.type)}
                    >
                      {getEventIcon(event.type)}
                    </div>
                    {i < events.length - 1 && (
                      <div
                        className="w-[2px] flex-1 my-2"
                        style={{ background: "var(--border)" }}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <p
                      className="text-sm font-bold leading-tight mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {event.message}
                    </p>
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {event.time}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div
                className="h-full flex flex-col items-center justify-center"
                style={{ color: "var(--text-muted)" }}
              >
                <div className="relative h-24 w-24 mb-4" aria-hidden="true">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: "1px solid rgba(129,178,154,0.25)",
                    }}
                  />
                  <div
                    className="absolute inset-3 rounded-full"
                    style={{
                      border: "1px solid rgba(190,227,248,0.35)",
                    }}
                  />
                  <div
                    className="absolute inset-6 rounded-full"
                    style={{
                      border: "1px solid rgba(242,204,143,0.35)",
                    }}
                  />
                  <div
                    className="absolute inset-[34px] rounded-full animate-pulse"
                    style={{
                      background: "rgba(129,178,154,0.7)",
                    }}
                  />
                </div>
                <p className="text-sm font-bold">Waiting for updates...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
};

const getEventIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle size={16} />;
    case "alert":
      return <Zap size={16} />;
    case "info":
      return <Info size={16} />;
    default:
      return <Radio size={16} />;
  }
};

const getEventStyles = (type) => {
  switch (type) {
    case "success":
      return {
        background: "rgba(129,178,154,0.95)",
        color: "#0B1320",
      };
    case "alert":
      return {
        background: "rgba(224,122,95,0.95)",
        color: "#FFFFFF",
      };
    case "info":
      return {
        background: "rgba(190,227,248,0.95)",
        color: "#3D405B",
      };
    default:
      return {
        background: "rgba(61,64,91,0.08)",
        color: "var(--text-muted)",
      };
  }
};

export default QueueLiveTimeline;
