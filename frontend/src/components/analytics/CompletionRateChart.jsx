import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CompletionRateChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No completion data available
      </div>
    );
  }

  const COLORS = {
    Completed: "#10b981",
    Waiting: "#3b82f6",
    Left: "#f59e0b",
    Skipped: "#ef4444",
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded p-2 text-sm">
          <p className="text-white font-medium">{item.name}</p>
          <p className="text-slate-300">{item.value} users</p>
          <p className="text-slate-400 text-xs">{item.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ name, percentage }) => {
    return `${name} ${percentage}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name} ${percentage}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name] || "#64748b"}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#e2e8f0" }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CompletionRateChart;
