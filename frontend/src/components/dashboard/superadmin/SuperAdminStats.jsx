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
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: `${stats.totalAdmins} admins`,
    },
    {
      label: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Building2,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: `${stats.unverifiedBusinesses} unverified`,
    },
    {
      label: "Verified Businesses",
      value: stats.verifiedBusinesses,
      icon: CheckCircle,
      color: "bg-green-50",
      iconColor: "text-green-600",
      trend: `${Math.round((stats.verifiedBusinesses / stats.totalBusinesses) * 100)}% of total`,
    },
    {
      label: "Active Queues",
      value: stats.activeQueues,
      icon: Zap,
      color: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: `${stats.totalQueues} total queues`,
    },
    {
      label: "Pending Reports",
      value: stats.pendingReports || 0,
      icon: AlertCircle,
      color: "bg-red-50",
      iconColor: "text-red-600",
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
            <Card className={`p-6 ${card.color} border-0`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${card.color}`}>
                  <Icon className={`${card.iconColor}`} size={24} />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">
                {card.label}
              </h3>
              <p className="text-3xl font-black text-slate-900 mb-2">
                {card.value}
              </p>
              <p className="text-xs text-slate-500 font-medium">{card.trend}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SuperAdminStats;
