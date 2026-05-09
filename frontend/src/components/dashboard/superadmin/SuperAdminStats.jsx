import React from "react";
import { Users, Building2, CheckCircle, Zap, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../ui/Card";

const SuperAdminStats = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500/20 to-blue-600/5",
      iconColor: "#3AA0FF",
      trend: `${stats.totalAdmins} admins`,
    },
    {
      label: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Building2,
      color: "from-purple-500/20 to-purple-600/5",
      iconColor: "#A78BFA",
      trend: `${stats.unverifiedBusinesses} unverified`,
    },
    {
      label: "Verified Businesses",
      value: stats.verifiedBusinesses,
      icon: CheckCircle,
      color: "from-green-500/20 to-green-600/5",
      iconColor: "#10B981",
      trend: `${Math.round((stats.verifiedBusinesses / stats.totalBusinesses) * 100)}% of total`,
    },
    {
      label: "Active Queues",
      value: stats.activeQueues,
      icon: Zap,
      color: "from-amber-500/20 to-amber-600/5",
      iconColor: "#F59E0B",
      trend: `${stats.totalQueues} total queues`,
    },
    {
      label: "Pending Reports",
      value: stats.pendingReports || 0,
      icon: AlertCircle,
      color: "from-red-500/20 to-red-600/5",
      iconColor: "#EF4444",
      trend: "Needs review",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div 
               className={`p-6 rounded-[2rem] bg-gradient-to-br ${card.color} border border-white/10 backdrop-blur-md h-full`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white/5">
                  <Icon style={{ color: card.iconColor }} size={24} />
                </div>
              </div>
              <h3 
                className="text-sm font-medium mb-1" 
                style={{ 
                  fontFamily: "var(--font-body)",
                  color: "rgba(247,244,239,0.9)"
                }}
              >
                {card.label}
              </h3>
              <p 
                className="text-3xl font-black mb-2" 
                style={{ 
                  fontFamily: "var(--font-heading)",
                  color: "#FFFFFF"
                }}
              >
                {card.value}
              </p>
              <p 
                className="text-xs font-medium"
                style={{ color: "rgba(247,244,239,0.6)" }}
              >
                {card.trend}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SuperAdminStats;
