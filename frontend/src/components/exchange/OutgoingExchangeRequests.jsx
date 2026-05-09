import React from "react";
import { Card } from "../ui/Card";
import { Clock, User, ArrowRightLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ExchangeStatusBadge from "./ExchangeStatusBadge";

const OutgoingExchangeRequests = ({ requests }) => {
  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-slate-200">
        <ArrowRightLeft size={48} className="mx-auto text-slate-200 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">No pending sent requests</h3>
        <p className="text-slate-500">Send a request to someone to swap spots in the queue</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <Card key={String(request._id)} className="p-5 border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <ExchangeStatusBadge status={request.status} />
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{request.toUser?.name}</h4>
              <p className="text-xs text-slate-500">{request.queueId?.title}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-around border border-slate-100">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Your Spot</p>
              <p className="text-xl font-black text-slate-800">#{request.fromTokenNumber}</p>
            </div>
            <ArrowRightLeft size={16} className="text-indigo-400" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Target Spot</p>
              <p className="text-xl font-black text-indigo-600">#{request.toTokenNumber}</p>
            </div>
          </div>
          
          {request.message && (
            <p className="mt-4 text-xs text-slate-500 italic px-2">
              Message: "{request.message}"
            </p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default OutgoingExchangeRequests;
