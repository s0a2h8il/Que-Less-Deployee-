import React from "react";
import { BellOff } from "lucide-react";
import { Card } from "../ui/Card";

const NotificationEmptyState = ({ title = "No notifications yet", message = "We'll notify you when something important happens." }) => {
  return (
    <Card className="p-12 text-center border-dashed border-slate-200">
      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <BellOff size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-xs mx-auto">{message}</p>
    </Card>
  );
};

export default NotificationEmptyState;
