import React from "react";
import { Building2, Clock, Users, ShieldCheck } from "lucide-react";
import { Card } from "../ui/Card";

const QueueStatusCard = ({ queue }) => {
  const { title, businessId, status, estimatedTimePerUser, members } = queue;
  const activeMembers =
    members?.filter((m) => m.status === "waiting").length || 0;

  const statusMap = {
    active: {
      label: "Active",
      style: {
        background: "rgba(129,178,154,0.18)",
        color: "var(--accent-3)",
        border: "1px solid rgba(129,178,154,0.35)",
      },
    },
    paused: {
      label: "Paused",
      style: {
        background: "rgba(242,204,143,0.2)",
        color: "#B7791F",
        border: "1px solid rgba(242,204,143,0.45)",
      },
    },
    closed: {
      label: "Closed",
      style: {
        background: "rgba(61,64,91,0.08)",
        color: "var(--text-muted)",
        border: "1px solid rgba(61,64,91,0.14)",
      },
    },
  };

  const currentStatus = statusMap[status] || statusMap.closed;

  return (
    <Card className="p-7 md:p-8 relative overflow-hidden">
      <div
        className="absolute -top-20 -right-16 h-40 w-40 rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(190,227,248,0.75) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(242,204,143,0.65) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-white"
            style={{
              background:
                "linear-gradient(135deg, rgba(61,64,91,0.98) 0%, rgba(79,93,117,0.92) 100%)",
              boxShadow: "0 12px 24px rgba(61,64,91,0.18)",
            }}
          >
            <Building2 size={32} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1
                className="text-2xl font-black leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h1>
              <span
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                style={currentStatus.style}
              >
                {currentStatus.label}
              </span>
            </div>
            <p
              className="font-medium flex items-center gap-1.5 whitespace-nowrap"
              style={{ color: "var(--text-secondary)" }}
            >
              by{" "}
              <span
                className="font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {businessId?.name || "Business"}
              </span>
              {businessId?.isVerified && (
                <ShieldCheck size={16} style={{ color: "#3AA0FF" }} />
              )}
            </p>
          </div>
        </div>

        <div
          className="flex gap-4 md:gap-8 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-center md:text-left">
            <div
              className="flex items-center gap-2 mb-1 whitespace-nowrap"
              style={{ color: "var(--text-muted)" }}
            >
              <Clock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Avg Time
              </span>
            </div>
            <p
              className="text-lg font-black"
              style={{ color: "var(--text-primary)" }}
            >
              {estimatedTimePerUser}m{" "}
              <span
                className="text-sm font-normal"
                style={{ color: "var(--text-muted)" }}
              >
                / user
              </span>
            </p>
          </div>
          <div className="text-center md:text-left">
            <div
              className="flex items-center gap-2 mb-1 whitespace-nowrap"
              style={{ color: "var(--text-muted)" }}
            >
              <Users size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Waiting
              </span>
            </div>
            <p
              className="text-lg font-black"
              style={{ color: "var(--text-primary)" }}
            >
              {activeMembers}{" "}
              <span
                className="text-sm font-normal"
                style={{ color: "var(--text-muted)" }}
              >
                users
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QueueStatusCard;
