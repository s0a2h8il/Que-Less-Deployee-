import React from "react";
import { Card } from "../ui/Card";
import { History, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import ExchangeStatusBadge from "./ExchangeStatusBadge";
import { useAuth } from "../../context/AuthContext";

const ExchangeHistory = ({ history }) => {
  const { user } = useAuth();

  if (history.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-slate-200">
        <History size={48} className="mx-auto text-slate-200 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">No exchange history</h3>
        <p className="text-slate-500">Your past swap requests will appear here</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => {
        const isSender = item.fromUser?._id === user?._id;
        const otherUser = isSender ? item.toUser : item.fromUser;

        return (
          <Card key={`${item._id}-${index}`} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <User size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-800">
                    {isSender ? `To: ${otherUser?.name}` : `From: ${otherUser?.name}`}
                  </h4>
                  <ExchangeStatusBadge status={item.status} />
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {item.queueId?.title} • {format(new Date(item.updatedAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-slate-50/50 px-6 py-2 rounded-2xl border border-slate-100">
              <div className="text-center">
                <p className="text-[10px] uppercase font-black text-slate-400">Before</p>
                <p className="text-sm font-bold text-slate-600">
                  #{isSender ? item.fromTokenNumber : item.toTokenNumber}
                </p>
              </div>
              <ArrowRight size={14} className="text-slate-300" />
              <div className="text-center">
                <p className="text-[10px] uppercase font-black text-indigo-400">After</p>
                <p className="text-sm font-black text-indigo-600">
                  #{isSender ? item.toTokenNumber : item.fromTokenNumber}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ExchangeHistory;
