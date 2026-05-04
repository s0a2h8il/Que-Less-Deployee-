import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Zap, CheckCircle, Info } from "lucide-react";
import { Card } from "../ui/Card";

const QueueLiveTimeline = ({ events }) => {
  return (
    <Card className="p-8 border-slate-100 shadow-soft h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-slate-900">
          <Radio size={20} className="text-emerald-500 animate-pulse" />
          <h4 className="text-lg font-black tracking-tight">Live Activity</h4>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        <AnimatePresence initial={false}>
          {events.length > 0 ? (
            events.map((event, i) => (
              <motion.div
                key={event.id || i}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 group"
              >
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${getEventStyles(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  {i < events.length - 1 && (
                    <div className="w-[2px] flex-1 bg-slate-100 my-2" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-bold text-slate-800 leading-tight mb-1">{event.message}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.time}</p>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-400">
                <Info size={48} className="mb-4" />
                <p className="text-sm font-bold">Waiting for updates...</p>
             </div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

const getEventIcon = (type) => {
  switch (type) {
    case 'success': return <CheckCircle size={16} />;
    case 'alert': return <Zap size={16} />;
    case 'info': return <Info size={16} />;
    default: return <Radio size={16} />;
  }
};

const getEventStyles = (type) => {
  switch (type) {
    case 'success': return 'bg-emerald-500 text-white';
    case 'alert': return 'bg-orange-500 text-white';
    case 'info': return 'bg-blue-600 text-white';
    default: return 'bg-slate-100 text-slate-500';
  }
};

export default QueueLiveTimeline;
