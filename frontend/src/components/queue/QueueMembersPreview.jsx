import React from "react";
import { motion } from "framer-motion";
import { Users, User as UserIcon } from "lucide-react";
import { Card } from "../ui/Card";

const QueueMembersPreview = ({ members, currentToken }) => {
  const parsedCurrent = Number(currentToken);
  const normalizedCurrent = Number.isFinite(parsedCurrent)
    ? parsedCurrent
    : null;

  // Only show waiting members after the current token
  const waitingMembers =
    members
      ?.filter((m) => m.status === "waiting")
      .filter((m) =>
        normalizedCurrent !== null
          ? Number(m.tokenNumber) > normalizedCurrent
          : true,
      )
      .sort((a, b) => a.tokenNumber - b.tokenNumber)
      .slice(0, 5) || [];

  return (
    <Card className="p-8 h-full min-h-[320px] relative overflow-hidden">
      <div
        className="absolute -top-12 -right-10 h-32 w-32 rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(190,227,248,0.65) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8">
          <Users size={20} style={{ color: "#3AA0FF" }} />
          <h4
            className="text-lg font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Next in Line
          </h4>
        </div>
        <div className="flex-1">
          <div className="space-y-4">
            {waitingMembers.length > 0 ? (
              waitingMembers.map((member, i) => {
                const isNext = i === 0;
                const rowStyle = isNext
                  ? {
                      background: "rgba(190,227,248,0.5)",
                      border: "1px solid rgba(190,227,248,0.9)",
                    }
                  : {
                      background: "rgba(255,255,255,0.75)",
                      border: "1px solid var(--border)",
                    };

                return (
                  <motion.div
                    key={member.tokenNumber}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all group"
                    style={rowStyle}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center font-black shadow-sm transition-all"
                        style={{
                          background: isNext
                            ? "rgba(190,227,248,0.75)"
                            : "var(--surface)",
                          border: isNext
                            ? "1px solid rgba(190,227,248,0.9)"
                            : "1px solid var(--border)",
                          color: "var(--primary)",
                        }}
                      >
                        {member.tokenNumber}
                      </div>
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                        style={{
                          background: "rgba(61,64,91,0.08)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <UserIcon size={16} />
                      </div>
                    </div>
                    {isNext ? (
                      <div
                        className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                        style={{
                          background: "rgba(255,255,255,0.7)",
                          border: "1px solid rgba(61,64,91,0.18)",
                          color: "var(--primary)",
                        }}
                      >
                        Next
                      </div>
                    ) : (
                      <div
                        className="h-1.5 w-12 rounded-full"
                        style={{ background: "rgba(61,64,91,0.18)" }}
                      />
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p
                  className="text-sm font-medium italic"
                  style={{ color: "var(--text-muted)" }}
                >
                  No users currently waiting.
                </p>
              </div>
            )}
          </div>

          {waitingMembers.length >= 5 && (
            <p
              className="mt-8 text-center text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              + others in queue
            </p>
          )}
        </div>

        <div
          className="mt-8 pt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Queue Pulse
            </span>
            <span
              className="live-badge text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Live
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div
              className="h-2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(190,227,248,0.9), rgba(190,227,248,0.2))",
              }}
            />
            <div
              className="h-2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(242,204,143,0.9), rgba(242,204,143,0.2))",
              }}
            />
            <div
              className="h-2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(129,178,154,0.9), rgba(129,178,154,0.2))",
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QueueMembersPreview;
