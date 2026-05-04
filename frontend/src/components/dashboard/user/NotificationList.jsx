import React from "react";
import { Bell, BellOff, Clock } from "lucide-react";
import { Card } from "../..";

const NotificationList = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <Card className="p-8 border-slate-50 shadow-sm flex flex-col items-center justify-center text-center">
         <BellOff size={40} className="text-slate-200 mb-4" />
         <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No new notifications</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map(notif => (
        <Card key={notif._id} className="p-4 border-slate-50 shadow-sm hover:border-blue-100 transition-all cursor-pointer group">
           <div className="flex gap-4">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <Bell size={18} />
              </div>
              <div className="flex-1">
                 <h5 className="text-sm font-bold text-slate-900 leading-tight mb-1">{notif.title}</h5>
                 <p className="text-xs text-slate-500 leading-snug mb-2">{notif.message}</p>
                 <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <Clock size={10} />
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : ""}
                 </div>
              </div>
           </div>
        </Card>
      ))}
    </div>
  );
};

export default NotificationList;
