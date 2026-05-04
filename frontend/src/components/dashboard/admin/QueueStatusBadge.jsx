import React from "react";
import { cn } from "../../../utils/cn";

const QueueStatusBadge = ({ status }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-700 border-green-200",
    paused: "bg-yellow-100 text-yellow-700 border-yellow-200",
    closed: "bg-red-100 text-red-700 border-red-200",
  };

  const currentStatus = status?.toLowerCase() || "active";

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[currentStatus] || statusStyles.active
      )}
    >
      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
    </span>
  );
};

export default QueueStatusBadge;
