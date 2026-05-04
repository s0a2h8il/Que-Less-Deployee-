import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Check, X, Clock, ArrowRightLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const IncomingExchangeRequests = ({ requests, onAccept, onReject }) => {
  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-slate-200">
        <ArrowRightLeft size={48} className="mx-auto text-slate-200 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">
          No incoming requests
        </h3>
        <p className="text-slate-500">
          When someone wants to swap spots with you, it will appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {requests.map((request) => (
        <Card
          key={request._id}
          className="p-6 border-indigo-50 hover:border-indigo-200 transition-all group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border-2 border-indigo-100">
                #{request.fromTokenNumber}
              </div>
              <div className="w-6 h-6 flex items-center justify-center text-slate-300">
                <ArrowRightLeft size={16} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-lg border-2 border-green-100">
                #{request.toTokenNumber}
              </div>
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
              {formatDistanceToNow(new Date(request.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-slate-800 text-lg mb-1">
              {request.fromUser?.name}
            </h4>
            <p className="text-sm text-slate-500 flex items-center gap-1 whitespace-nowrap">
              <Clock size={12} /> {request.queueId?.title}
            </p>
            {request.message && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-sm text-slate-600 italic border-l-4 border-indigo-500">
                "{request.message}"
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
              onClick={() => onReject(request._id)}
            >
              <X size={16} /> Reject
            </Button>
            <Button
              className="flex-1 rounded-xl gap-2 shadow-lg shadow-indigo-100"
              onClick={() => onAccept(request._id)}
            >
              <Check size={16} /> Accept
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default IncomingExchangeRequests;
