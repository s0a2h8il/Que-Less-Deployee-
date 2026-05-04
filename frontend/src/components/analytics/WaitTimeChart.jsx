import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WaitTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        No queue data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded p-2 text-sm">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-blue-400">{payload[0].value} minutes</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: "#cbd5e1" }}
        />
        <YAxis
          label={{
            value: "Wait Time (minutes)",
            angle: -90,
            position: "insideLeft",
          }}
          tick={{ fill: "#cbd5e1" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#e2e8f0", paddingTop: "20px" }} />
        <Bar
          dataKey="waitTime"
          fill="#3b82f6"
          name="Average Wait Time"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WaitTimeChart;
