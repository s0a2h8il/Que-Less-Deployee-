import React from "react";
import { cn } from "../../utils/cn";

const ExchangeStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    accepted: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider",
        statusConfig[status] || statusConfig.pending
      )}
    >
      {status}
    </span>
  );
};

export default ExchangeStatusBadge;
