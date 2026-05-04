import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BellRing, Clock, Users } from "lucide-react";
import { queueApi } from "../../api/queueApi";
import { useAuth } from "../../context/AuthContext";

const palette = {
  peach: "#E07A5F",
  mint: "#81B29A",
  ink: "#3D405B",
};

const EmptyQueueCard = ({ title, message }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.72)",
      border: "1px solid rgba(61,64,91,0.14)",
      borderRadius: "1.5rem",
      overflow: "hidden",
      boxShadow: "0 24px 54px rgba(61,64,91,0.14)",
      backdropFilter: "blur(16px)",
      padding: "2.5rem 2rem",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 64,
        height: 64,
        margin: "0 auto 1rem",
        borderRadius: 18,
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
        color: "#fff",
        fontSize: "1.6rem",
        boxShadow: "0 14px 32px rgba(224,122,95,0.28)",
      }}
    >
      🎫
    </div>
    <h3
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: "1.35rem",
        fontWeight: 800,
        color: palette.ink,
        marginBottom: "0.5rem",
      }}
    >
      {title}
    </h3>
    <p
      style={{
        fontFamily: "var(--font-body)",
        color: "rgba(61,64,91,0.68)",
        fontSize: "0.96rem",
        lineHeight: 1.6,
      }}
    >
      {message}
    </p>
  </div>
);

const AnimatedQueuePreview = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasRealData, setHasRealData] = useState(false);
  const [currentToken, setCurrentToken] = useState(null);
  const [waitTime, setWaitTime] = useState(null);
  const [aheadCount, setAheadCount] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const resolveQueueData = async () => {
      try {
        const activeQueueResponse = isAuthenticated
          ? await queueApi.getMyActive().catch(() => null)
          : null;

        let queue = activeQueueResponse?.data ?? activeQueueResponse ?? null;

        if (!queue && isAuthenticated) {
          const allQueuesResponse = await queueApi.getAll().catch(() => null);
          const allQueues = Array.isArray(allQueuesResponse?.data)
            ? allQueuesResponse.data
            : Array.isArray(allQueuesResponse)
              ? allQueuesResponse
              : [];

          queue = allQueues.find((item) =>
            Array.isArray(item.members)
              ? item.members.some((member) => member.userId === user?._id)
              : false,
          );
        }

        if (cancelled) return;

        if (
          !queue ||
          !Array.isArray(queue.members) ||
          queue.members.length === 0
        ) {
          setHasRealData(false);
          setMembers([]);
          setCurrentToken(null);
          setWaitTime(null);
          setAheadCount(null);
          return;
        }

        const userMember = queue.members.find((member) => {
          if (user?._id) return member.userId === user._id;
          return (
            member.isCurrentUser || member.isSelf || member.label === "You"
          );
        });

        const sortedMembers = [...queue.members].sort((a, b) => {
          const aToken = Number(a.tokenNumber ?? a.token ?? a.position ?? 0);
          const bToken = Number(b.tokenNumber ?? b.token ?? b.position ?? 0);
          return aToken - bToken;
        });

        const activeToken = Number(
          queue.currentToken ??
            queue.currentServingToken ??
            queue.calledToken ??
            userMember?.tokenNumber ??
            userMember?.token ??
            sortedMembers[0]?.tokenNumber ??
            sortedMembers[0]?.token ??
            null,
        );

        const userToken = Number(
          userMember?.tokenNumber ?? userMember?.token ?? null,
        );
        const membersAhead = Number.isFinite(userToken)
          ? sortedMembers.filter((member) => {
              const token = Number(
                member.tokenNumber ?? member.token ?? member.position ?? 0,
              );
              return token < userToken && member.status !== "completed";
            }).length
          : 0;

        const estimatedMinutes = Number.isFinite(membersAhead)
          ? membersAhead * 5
          : 0;
        const displayWait =
          estimatedMinutes > 0 ? `~${estimatedMinutes}m` : "Your turn";

        const userFirst = userMember
          ? {
              id: userMember.userId ?? "you",
              token: Number(
                userMember.tokenNumber ??
                  userMember.token ??
                  userToken ??
                  activeToken ??
                  0,
              ),
              label: "You",
              status: userMember.status === "called" ? "Called" : "Waiting",
              active: userMember.status === "called",
            }
          : null;

        const otherMembers = sortedMembers
          .filter((member) =>
            userMember?.userId ? member.userId !== userMember.userId : true,
          )
          .slice(0, 2)
          .map((member, index) => ({
            id:
              member.userId ?? `${member.tokenNumber ?? member.token ?? index}`,
            token: Number(
              member.tokenNumber ?? member.token ?? member.position ?? 0,
            ),
            label:
              member.name ||
              `Token ${member.tokenNumber ?? member.token ?? member.position ?? index + 1}`,
            status:
              member.status === "called"
                ? "Called"
                : member.status === "completed"
                  ? "Completed"
                  : "Waiting",
            active: member.status === "called",
          }));

        const previewMembers = userFirst
          ? [userFirst, ...otherMembers]
          : otherMembers;

        setCurrentToken(Number.isFinite(activeToken) ? activeToken : null);
        setWaitTime(displayWait);
        setAheadCount(membersAhead);
        setMembers(previewMembers);
        setHasRealData(true);
      } catch (error) {
        if (!cancelled) {
          setHasRealData(false);
          setMembers([]);
          setCurrentToken(null);
          setWaitTime(null);
          setAheadCount(null);
        }
        console.log("Queue preview could not load real data:", error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    resolveQueueData();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?._id]);

  if (loading) {
    return (
      <div
        className="relative mx-auto"
        style={{ maxWidth: 390, overflow: "visible" }}
      >
        <EmptyQueueCard
          title="Loading queue"
          message="Fetching your live queue data..."
        />
      </div>
    );
  }

  if (!hasRealData) {
    return (
      <div
        className="relative mx-auto"
        style={{ maxWidth: 390, overflow: "visible" }}
      >
        <EmptyQueueCard
          title="No live queue data"
          message="Join a queue to see your position, wait time, and nearby customers here."
        />
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto"
      style={{ maxWidth: 390, overflow: "visible" }}
    >
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-20 flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{
          top: "-1.8rem",
          right: "-1rem",
          background: "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
          boxShadow: "0 12px 28px rgba(224,122,95,0.35)",
          fontFamily: "var(--font-heading)",
          fontSize: "1.15rem",
          fontWeight: 800,
        }}
      >
        {(aheadCount ?? 0) + 1}
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute z-20 flex h-20 w-20 items-center justify-center rounded-full text-white"
        style={{
          bottom: "-1.5rem",
          left: "-2rem",
          background: "linear-gradient(135deg, #3D405B 0%, #81B29A 100%)",
          boxShadow: "0 12px 28px rgba(61,64,91,0.24)",
        }}
      >
        <div className="text-center">
          <div
            className="text-[10px] font-medium"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            Token
          </div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.6rem",
              fontWeight: 900,
              lineHeight: 1,
              color: "#FFFFFF",
            }}
          >
            {currentToken ?? "-"}
          </div>
        </div>
      </motion.div>

      <div
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(61,64,91,0.14)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 24px 54px rgba(61,64,91,0.14)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(129,178,154,0.22) 0%, rgba(190,227,248,0.50) 100%)",
            padding: "1.5rem",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: "rgba(255,255,255,0.82)",
                color: palette.ink,
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(61,64,91,0.08)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ background: palette.mint }}
              />
              Live Queue
            </div>
            <BellRing size={17} style={{ color: palette.ink }} />
          </div>
          <div className="text-center">
            <h4
              className="text-sm font-medium"
              style={{
                color: "rgba(61,64,91,0.70)",
                fontFamily: "var(--font-body)",
              }}
            >
              Your Queue
            </h4>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2.5rem",
                fontWeight: 900,
                color: palette.ink,
                marginTop: 8,
                letterSpacing: "-0.03em",
              }}
            >
              Token {currentToken ?? "-"}
            </div>
          </div>
        </div>

        <div style={{ padding: "1.5rem" }}>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { Icon: Clock, label: "Wait Time", value: waitTime ?? "-" },
              {
                Icon: Users,
                label: "Ahead",
                value: `${aheadCount ?? 0} users`,
              },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(61,64,91,0.08)",
                }}
              >
                <Icon
                  size={18}
                  className="mx-auto mb-2"
                  style={{ color: palette.peach }}
                />
                <div
                  className="text-[10px] font-bold uppercase tracking-wider mb-1"
                  style={{ color: "rgba(61,64,91,0.42)" }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    color: palette.ink,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-between rounded-xl border p-3"
                style={{
                  background: member.active
                    ? "linear-gradient(135deg, rgba(129,178,154,0.18) 0%, rgba(190,227,248,0.18) 100%)"
                    : "rgba(255,255,255,0.62)",
                  border: member.active
                    ? "1px solid rgba(129,178,154,0.28)"
                    : "1px solid rgba(61,64,91,0.08)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                    style={{
                      background: member.active
                        ? palette.peach
                        : "rgba(61,64,91,0.06)",
                      color: member.active ? "#FFFFFF" : palette.ink,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {member.token}
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: palette.ink,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {member.label}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: member.active ? palette.mint : "rgba(61,64,91,0.34)",
                  }}
                >
                  {member.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedQueuePreview;
