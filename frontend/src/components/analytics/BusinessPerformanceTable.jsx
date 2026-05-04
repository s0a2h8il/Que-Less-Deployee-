import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const BusinessPerformanceTable = ({ queueStats }) => {
  // Group by business for performance metrics
  const businessMetrics = useMemo(() => {
    const metrics = {};

    if (!queueStats || queueStats.length === 0) {
      return [];
    }

    queueStats.forEach((queue) => {
      const businessName = queue.businessName || "Unknown";
      if (!metrics[businessName]) {
        metrics[businessName] = {
          name: businessName,
          totalQueues: 0,
          joinedUsers: 0,
          completedUsers: 0,
          totalWaitTime: 0,
          queueCount: 0,
          avgCompletionRate: 0,
          activeQueues: 0,
        };
      }

      metrics[businessName].totalQueues++;
      metrics[businessName].joinedUsers += queue.totalMembers || 0;
      metrics[businessName].completedUsers += queue.completedMembers || 0;
      metrics[businessName].totalWaitTime += queue.avgWaitingTime || 0;
      metrics[businessName].queueCount++;
      metrics[businessName].avgCompletionRate += queue.completionRate || 0;
      if (queue.status === "active") metrics[businessName].activeQueues++;
    });

    // Calculate averages
    return Object.values(metrics).map((business) => ({
      ...business,
      avgWaitTime: Math.round(business.totalWaitTime / business.queueCount),
      avgCompletionRate: Math.round(
        business.avgCompletionRate / business.queueCount,
      ),
    }));
  }, [queueStats]);

  if (businessMetrics.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p>No business performance data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Business
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Queues
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Joined
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Completed
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Avg Wait
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Completion
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Active
            </th>
          </tr>
        </thead>
        <tbody>
          {businessMetrics.map((business, idx) => (
            <motion.tr
              key={business.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border-b border-slate-700/50 hover:bg-slate-700/20 transition"
            >
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-white">
                  {business.name}
                </p>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-300">
                  {business.totalQueues}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-300">
                  {business.joinedUsers}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-green-400 font-medium">
                  {business.completedUsers}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-300">
                  {business.avgWaitTime}m
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-green-500 to-emerald-400"
                      style={{ width: `${business.avgCompletionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    {business.avgCompletionRate}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  {business.activeQueues} active
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessPerformanceTable;
