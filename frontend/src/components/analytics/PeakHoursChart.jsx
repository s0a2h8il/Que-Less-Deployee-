import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PeakHoursChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400">
        No peak hours data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded p-2 text-sm">
          <p className="text-white font-medium">{payload[0].payload.hour}</p>
          <p className="text-purple-400">{payload[0].value} joins</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="hour"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: "#cbd5e1" }}
        />
        <YAxis
          label={{
            value: "Number of Joins",
            angle: -90,
            position: "insideLeft",
          }}
          tick={{ fill: "#cbd5e1" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#e2e8f0", paddingTop: "20px" }} />
        <Line
          type="monotone"
          dataKey="joins"
          stroke="#a855f7"
          strokeWidth={2}
          dot={{ fill: "#a855f7", r: 4 }}
          activeDot={{ r: 6 }}
          name="Queue Joins"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PeakHoursChart;
