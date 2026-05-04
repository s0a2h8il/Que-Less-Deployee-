import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const QueueStatusChart = ({ data }) => {
  if (!data) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No data available
      </div>
    );
  }

  const chartData = [
    { name: "Active", value: data.activeQueues || 0 },
    { name: "Paused", value: data.pausedQueues || 0 },
    { name: "Closed", value: data.closedQueues || 0 },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded p-2 text-sm">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-indigo-400">{payload[0].value} queues</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#e2e8f0" }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default QueueStatusChart;
