import React from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Zap, Clock } from "lucide-react";

const AnalyticsStats = ({ overview }) => {
  if (!overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-700/50 rounded-lg h-32 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Queues",
      value: overview.queueStats?.totalQueues || 0,
      subtext: `${overview.queueStats?.activeQueues || 0} active`,
      icon: Zap,
      color: "from-blue-600 to-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Avg Wait Time",
      value: `${overview.waitingTime?.average || 0}m`,
      subtext: "minutes",
      icon: Clock,
      color: "from-amber-600 to-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Completed Users",
      value: overview.userStats?.totalCompleted || 0,
      subtext: `${overview.userStats?.completionRate || 0}% completion`,
      icon: TrendingUp,
      color: "from-green-600 to-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Users",
      value: overview.userStats?.total || 0,
      subtext: `${overview.userStats?.totalWaiting || 0} waiting`,
      icon: Users,
      color: "from-purple-600 to-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-6 border border-slate-700/50 backdrop-blur`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-300 text-sm font-medium">
                {stat.title}
              </h3>
              <div className={`p-2 rounded-lg bg-linear-to-br ${stat.color}`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-2">{stat.subtext}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AnalyticsStats;
