import React from "react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { 
  Play, 
  Pause, 
  XCircle, 
  UserPlus, 
  RefreshCcw 
} from "lucide-react";
import QueueStatusBadge from "./QueueStatusBadge";

const QueueControlPanel = ({ 
  queue, 
  onCallNext, 
  onPause, 
  onResume, 
  onClose 
}) => {
  if (!queue) return null;

  const isPaused = queue.status === "paused";
  const isClosed = queue.status === "closed";
  const isActive = queue.status === "active";

  return (
    <Card className="p-8 bg-white border-indigo-100 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <QueueStatusBadge status={queue.status} />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-800 mb-1">{queue.title}</h2>
          <p className="text-slate-500 mb-6">{queue.business?.name}</p>

          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Currently Serving
            </span>
            <div className="text-7xl font-black text-indigo-600 tabular-nums">
              #{queue.stats?.currentToken || "---"}
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <Button
            size="lg"
            className="h-24 flex flex-col gap-2 rounded-3xl"
            onClick={onCallNext}
            disabled={isClosed || isPaused}
          >
            <UserPlus size={28} />
            <span>Call Next</span>
          </Button>

          {isPaused ? (
            <Button
              size="lg"
              variant="outline"
              className="h-24 flex flex-col gap-2 rounded-3xl border-green-200 text-green-600 hover:bg-green-50"
              onClick={onResume}
              disabled={isClosed}
            >
              <Play size={28} />
              <span>Resume</span>
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="h-24 flex flex-col gap-2 rounded-3xl border-yellow-200 text-yellow-600 hover:bg-yellow-50"
              onClick={onPause}
              disabled={isClosed}
            >
              <Pause size={28} />
              <span>Pause</span>
            </Button>
          )}

          <Button
            size="lg"
            variant="outline"
            className="h-24 flex flex-col gap-2 rounded-3xl border-red-200 text-red-600 hover:bg-red-50 col-span-2"
            onClick={onClose}
            disabled={isClosed}
          >
            <XCircle size={28} />
            <span>Close Queue</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-slate-500">Waiting</p>
          <p className="text-xl font-bold text-slate-800">{queue.stats?.waitingCount || 0}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Served</p>
          <p className="text-xl font-bold text-slate-800">{queue.stats?.completedCount || 0}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-xl font-bold text-slate-800">{queue.stats?.totalJoined || 0}</p>
        </div>
      </div>
    </Card>
  );
};

export default QueueControlPanel;
