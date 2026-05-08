import React from "react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Play, Pause, XCircle, UserPlus, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QueueStatusBadge from "./QueueStatusBadge";

const QueueControlPanel = ({
  queue,
  onCallNext,
  onPause,
  onResume,
  onClose,
  onStart,
}) => {
  if (!queue) return null;

  const isPaused = queue.status === "paused";
  const isClosed = queue.status === "closed";
  const isActive = queue.status === "active";

  return (
    <Card className="p-8 bg-white border-indigo-100 shadow-xl overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
            <h2 className="text-3xl font-black text-slate-800">
              {queue.title}
            </h2>
            <QueueStatusBadge status={queue.status} />
          </div>
          <p className="text-slate-500 mb-6">{queue.business?.name}</p>

          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Currently Serving
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${queue._id}-${queue.stats?.currentToken}-${queue._lastUpdate}`}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="text-5xl sm:text-7xl font-black text-indigo-600 tabular-nums"
              >
                {queue.members?.some(m => m.status === 'called') 
                  ? `#${queue.stats?.currentToken || queue.currentToken}` 
                  : "---"}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <Button
            size="lg"
            className="h-20 sm:h-24 flex flex-col gap-2 rounded-3xl"
            onClick={onCallNext}
            disabled={isClosed || isPaused}
          >
            <UserPlus size={28} />
            <span>Call Next</span>
          </Button>

          {isPaused ? (
            <Button
              size="lg"
              className="h-20 sm:h-24 flex flex-col gap-2 rounded-3xl shadow-lg border-none"
              style={{ 
                background: "#dcfce7", // light green (emerald-100)
                color: "#059669" // emerald-600
              }}
              onClick={onResume}
              disabled={isClosed}
            >
              <Play size={28} />
              <span>Resume</span>
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-20 sm:h-24 flex flex-col gap-2 rounded-3xl shadow-lg border-none"
              style={{ 
                background: isActive ? "#d97706" : "#fef3c7", // dark amber-600 if active, light if not
                color: isActive ? "#ffffff" : "#d97706"
              }}
              onClick={onPause}
              disabled={isClosed}
            >
              <Pause size={28} />
              <span>Pause</span>
            </Button>
          )}

          <Button
            size="lg"
            className={`h-20 sm:h-24 flex flex-col gap-2 rounded-3xl shadow-lg border-none ${isClosed ? "sm:col-span-1" : "sm:col-span-2"}`}
            style={{ 
              background: isClosed ? "#fee2e2" : "#b91c1c", // light red-100 if closed, dark red-700 if not
              color: isClosed ? "#b91c1c" : "#ffffff"
            }}
            onClick={onClose}
            disabled={isClosed}
          >
            <XCircle size={28} />
            <span>Close Queue</span>
          </Button>

          {isClosed && (
            <Button
              size="lg"
              className="h-20 sm:h-24 flex flex-col gap-2 rounded-3xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
              onClick={onStart}
            >
              <Play size={28} />
              <span>Start Queue</span>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-slate-500">Waiting</p>
          <p className="text-xl font-bold text-slate-800">
            {queue.stats?.waitingCount || 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Served</p>
          <p className="text-xl font-bold text-slate-800">
            {queue.stats?.completedCount || 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-xl font-bold text-slate-800">
            {queue.stats?.totalJoined || 0}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default QueueControlPanel;
