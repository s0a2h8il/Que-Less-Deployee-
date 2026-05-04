import React from "react";
import { Building2, Clock, Users, ShieldCheck } from "lucide-react";
import { Card } from "../ui/Card";
import { cn } from "../../utils/cn";

const QueueStatusCard = ({ queue }) => {
  const { title, businessId, status, estimatedTimePerUser, members } = queue;
  const activeMembers = members?.filter(m => m.status === 'waiting').length || 0;

  const statusMap = {
    active: { label: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    paused: { label: "Paused", color: "text-amber-600 bg-amber-50 border-amber-100" },
    closed: { label: "Closed", color: "text-slate-400 bg-slate-50 border-slate-100" },
  };

  const currentStatus = statusMap[status] || statusMap.closed;

  return (
    <Card className="p-8 border-slate-100 shadow-soft">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
             <Building2 size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900 leading-tight">{title}</h1>
              <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", currentStatus.color)}>
                {currentStatus.label}
              </span>
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-1.5">
              by <span className="text-slate-900 font-bold">{businessId?.name || "Business"}</span>
              {businessId?.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
            </p>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
           <div className="text-center md:text-left">
             <div className="flex items-center gap-2 text-slate-400 mb-1">
               <Clock size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Avg Time</span>
             </div>
             <p className="text-lg font-black text-slate-900">{estimatedTimePerUser}m <span className="text-sm font-normal text-slate-400">/ user</span></p>
           </div>
           <div className="text-center md:text-left">
             <div className="flex items-center gap-2 text-slate-400 mb-1">
               <Users size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Waiting</span>
             </div>
             <p className="text-lg font-black text-slate-900">{activeMembers} <span className="text-sm font-normal text-slate-400">users</span></p>
           </div>
        </div>
      </div>
    </Card>
  );
};

export default QueueStatusCard;
