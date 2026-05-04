import React from "react";
import { motion } from "framer-motion";
import { Users, User as UserIcon } from "lucide-react";
import { Card } from "../ui/Card";

const QueueMembersPreview = ({ members, currentToken }) => {
  // Only show waiting members
  const waitingMembers = members?.filter(m => m.status === 'waiting').sort((a, b) => a.tokenNumber - b.tokenNumber).slice(0, 5) || [];

  return (
    <Card className="p-8 border-slate-100 shadow-soft h-full">
      <div className="flex items-center gap-2 mb-8 text-slate-900">
        <Users size={20} className="text-blue-600" />
        <h4 className="text-lg font-black tracking-tight">Next in Line</h4>
      </div>

      <div className="space-y-4">
        {waitingMembers.length > 0 ? (
          waitingMembers.map((member, i) => (
            <motion.div
              key={member.tokenNumber}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-blue-100 hover:bg-white transition-all group"
            >
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-blue-600 font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {member.tokenNumber}
                 </div>
                 <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <UserIcon size={16} />
                 </div>
              </div>
              <div className="h-1.5 w-12 rounded-full bg-slate-200/50" />
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center">
             <p className="text-slate-400 text-sm font-medium italic">No users currently waiting.</p>
          </div>
        )}
      </div>

      {waitingMembers.length >= 5 && (
        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          + others in queue
        </p>
      )}
    </Card>
  );
};

export default QueueMembersPreview;
