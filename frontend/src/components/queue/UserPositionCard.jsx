import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Hourglass, TrendingDown, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";

const UserPositionCard = ({ userMember, queue }) => {
  if (!userMember || userMember.status !== 'waiting') {
    return (
      <Card className="p-8 border-dashed border-2 border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
           <UserCircle size={32} />
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">Your Spot</h4>
        <p className="text-slate-500 text-sm max-w-[200px]">Join this queue to get your token and track your position live.</p>
      </Card>
    );
  }

  const { tokenNumber } = userMember;
  const { currentToken, estimatedTimePerUser, members } = queue;
  
  // Calculate position: how many waiting users have lower token numbers
  const aheadCount = members?.filter(m => m.status === 'waiting' && m.tokenNumber < tokenNumber).length || 0;
  const waitTime = aheadCount * estimatedTimePerUser;
  const isNear = aheadCount <= 3;

  return (
    <Card className={`p-8 shadow-xl transition-all relative overflow-hidden ${
      isNear ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
    }`}>
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <UserCircle size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Your Token</p>
                <p className="text-xl font-black">#{tokenNumber}</p>
             </div>
          </div>
          {isNear && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-orange-600 font-black text-[10px] uppercase tracking-widest"
            >
              <AlertCircle size={14} />
              Turn Near
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
           <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-1 opacity-70">
                <TrendingDown size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">People Ahead</span>
             </div>
             <p className="text-2xl font-black">{aheadCount}</p>
           </div>
           <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-1 opacity-70">
                <Hourglass size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Wait Time</span>
             </div>
             <p className="text-2xl font-black">{waitTime}m</p>
           </div>
        </div>

        <p className="mt-8 text-xs font-medium opacity-70 text-center">
           We'll notify you when you are next in line.
        </p>
      </div>
    </Card>
  );
};

export default UserPositionCard;
