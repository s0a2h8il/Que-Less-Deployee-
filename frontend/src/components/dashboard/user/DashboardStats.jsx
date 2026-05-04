import React from "react";
import { Layers, MapPin, Bell } from "lucide-react";
import { Card } from "../..";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        icon={Layers} 
        label="Active Queues" 
        value={stats.activeCount} 
        color="bg-blue-50 text-blue-600" 
      />
      <StatCard 
        icon={MapPin} 
        label="Nearest Position" 
        value={stats.nearestPosition || "-"} 
        color="bg-teal-50 text-teal-600" 
      />
      <StatCard 
        icon={Bell} 
        label="Unread Notifications" 
        value={stats.unreadCount ?? 0} 
        color="bg-orange-50 text-orange-600" 
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className="p-6 border-slate-50 shadow-sm flex items-center gap-5">
    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${color}`}>
       <Icon size={28} />
    </div>
    <div>
       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
       <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  </Card>
);

export default DashboardStats;
