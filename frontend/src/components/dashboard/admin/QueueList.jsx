import React from "react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Users, Clock, ArrowRight } from "lucide-react";
import QueueStatusBadge from "./QueueStatusBadge";

const QueueList = ({ queues, onSelect }) => {
  if (!queues || !Array.isArray(queues) || queues.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
        <Users size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">
          No queues found
        </h3>
        <p className="text-slate-500">
          Create your first queue to start managing customers
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {queues.map((queue) => (
        <Card
          key={queue._id}
          className="p-6 hover:shadow-lg transition-shadow border-slate-100 group"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {queue.title}
              </h3>
              <p className="text-sm text-slate-500">{queue.business?.name}</p>
            </div>
            <QueueStatusBadge status={queue.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Users size={12} /> Waiting
              </p>
              <p className="text-xl font-bold text-slate-800">
                {queue.stats?.waitingCount || 0}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Clock size={12} /> Current
              </p>
              <p className="text-xl font-bold text-indigo-600">
                #{queue.stats?.currentToken || "---"}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => onSelect(queue._id)}
          >
            Manage Queue <ArrowRight size={16} />
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default QueueList;
