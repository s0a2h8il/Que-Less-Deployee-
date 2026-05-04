import React from "react";
import { Card } from "../../ui/Card";
import { Users, Clock, CheckCircle2, User } from "lucide-react";
import { cn } from "../../../utils/cn";

const WaitingUsersList = ({ members = [] }) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
        <Users size={40} className="mx-auto text-slate-300 mb-2" />
        <p className="text-slate-500 font-medium">No users in queue</p>
      </div>
    );
  }

  // Sort members: called first, then waiting by token number
  const sortedMembers = [...members].sort((a, b) => {
    if (a.status === "called" && b.status !== "called") return -1;
    if (a.status !== "called" && b.status === "called") return 1;
    return a.tokenNumber - b.tokenNumber;
  });

  return (
    <Card className="bg-white border-slate-100 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Users size={18} /> Waiting Users
        </h3>
        <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
          {members.filter(m => m.status !== "completed" && m.status !== "cancelled").length} Total
        </span>
      </div>

      <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
        {sortedMembers.map((member) => (
          <div
            key={member._id}
            className={cn(
              "p-4 flex items-center justify-between transition-colors",
              member.status === "called" ? "bg-indigo-50/50" : "hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg tabular-nums border-2",
                  member.status === "called"
                    ? "bg-indigo-600 text-white border-indigo-200 animate-pulse"
                    : "bg-white text-slate-700 border-slate-100"
                )}
              >
                #{member.tokenNumber}
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {member.userId?.name || "Guest User"}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> Joined at {new Date(member.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md",
                  member.status === "called"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {member.status}
              </span>
              {member.status === "called" && (
                <CheckCircle2 size={18} className="text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WaitingUsersList;
