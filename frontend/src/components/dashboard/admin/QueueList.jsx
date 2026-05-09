import React from "react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Users, Clock, ArrowRight, Edit2, Trash2, BadgeCheck } from "lucide-react";
import QueueStatusBadge from "./QueueStatusBadge";

const QueueList = ({ queues, onSelect, onEdit, onDelete }) => {
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
        <div
          key={queue._id}
          className="group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(58,160,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0, 0, 0, 0.15)";
          }}
        >
          {/* Decorative Background Blob */}
          <div 
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-[50px] pointer-events-none z-0 transform group-hover:scale-110"
            style={{ background: "radial-gradient(circle, rgba(58,160,255,0.1) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <h3 
                className="font-black text-2xl mb-1.5 truncate transition-colors duration-300 group-hover:text-indigo-600"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#0f172a", // slate-900
                  letterSpacing: "-0.03em"
                }}
              >
                {queue.title}
              </h3>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-slate-500">{queue.business?.name}</p>
                {queue.business?.isVerified && (
                  <div className="relative group/tooltip inline-block leading-none">
                    <BadgeCheck 
                      size={14} 
                      className="shrink-0 cursor-help" 
                      style={{ color: "#3AA0FF" }} 
                      fill="rgba(58,160,255,0.08)" 
                    />
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                      Verified Business
                      <div className="absolute top-full right-1 border-4 border-transparent border-t-slate-900" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <QueueStatusBadge status={queue.status} />
              <div className="flex gap-1 transition-all duration-300">
                {onEdit && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(queue); }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all hover:scale-110"
                    title="Edit Queue"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this queue?")) {
                        onDelete(queue._id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                    title="Delete Queue"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-auto">
            <div className="bg-[#f8fafc] border border-slate-100 p-4 rounded-2xl transition-colors duration-300 group-hover:bg-indigo-50/50">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Users size={14} className="text-indigo-400" /> Waiting
              </p>
              <p className="text-3xl font-black text-slate-800">
                {queue.stats?.waitingCount || 0}
              </p>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 p-4 rounded-2xl transition-colors duration-300 group-hover:bg-indigo-50/50">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Clock size={14} className="text-indigo-400" /> Current
              </p>
              <p className="text-3xl font-black text-indigo-600">
                #{queue.stats?.currentToken || "---"}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="relative z-10 w-full flex items-center justify-center gap-2 h-12 rounded-xl border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all font-bold"
            onClick={() => onSelect(queue._id)}
          >
            Manage Queue <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default QueueList;
