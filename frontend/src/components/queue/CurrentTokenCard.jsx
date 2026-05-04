import React from "react";
import { motion } from "framer-motion";
import { Hash, Activity } from "lucide-react";
import { Card } from "../ui/Card";

const CurrentTokenCard = ({ queue }) => {
  const { currentToken } = queue;

  return (
    <Card className="relative overflow-hidden bg-white border-slate-100 shadow-soft p-8">
      <div className="absolute top-0 right-0 p-4">
         <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
           <Activity size={14} className="animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">Live Now</span>
         </div>
      </div>

      <div className="flex flex-col items-center text-center py-4">
        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
           <Hash size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Now Serving</h4>
        <motion.div
          key={currentToken}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl font-black text-slate-900 tracking-tighter"
        >
          {currentToken || "0"}
        </motion.div>
        <p className="mt-4 text-slate-500 font-medium max-w-[180px]">
          Token {currentToken || 0} is currently being attended.
        </p>
      </div>

      {/* Background Graphic */}
      <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-blue-50/50 rounded-full blur-2xl pointer-events-none" />
    </Card>
  );
};

export default CurrentTokenCard;
