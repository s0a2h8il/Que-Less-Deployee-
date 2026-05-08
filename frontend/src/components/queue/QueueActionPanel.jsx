import React from "react";
import { LogIn, LogOut, PauseCircle, Ban, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const QueueActionPanel = ({
  queue,
  userMember,
  onJoin,
  onLeave,
  joining,
  leaving,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { status, business, businessId } = queue;

  const currentBusiness = business || businessId;
  const isOwner = user && currentBusiness?.ownerId && user._id === currentBusiness.ownerId;
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
            style={{
              background: "rgba(190,227,248,0.6)",
              color: "var(--primary)",
              border: "1px solid rgba(61,64,91,0.12)",
            }}
          >
            <LogIn size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold" style={{ color: "var(--text-primary)" }}>
              Login Required
            </h4>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Sign in to join this queue and get your token.
            </p>
          </div>
          <Link to="/login">
            <Button size="sm" variant="info">
              Login
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Prevent Admins/Owners from joining their own queue
  if (isOwner) {
    return (
      <Card className="p-6 bg-slate-50 border-slate-200">
        <div className="flex items-center gap-4 text-slate-500">
          <AlertCircle size={24} className="shrink-0" />
          <p className="text-sm font-medium">
            You are the operator of this queue. Manage it from your <Link to="/admin/dashboard" className="text-indigo-600 underline">Admin Dashboard</Link>.
          </p>
        </div>
      </Card>
    );
  }

  // Handle various queue statuses
  if (status === "paused") {
    return (
      <Card
        className="p-6 flex items-center gap-4"
        style={{
          background: "rgba(242,204,143,0.24)",
          border: "1px solid rgba(242,204,143,0.5)",
          color: "#8B5E1A",
        }}
      >
        <PauseCircle size={24} className="shrink-0" />
        <p className="text-sm font-bold">
          This queue is currently paused. Please check back later.
        </p>
      </Card>
    );
  }

  if (status === "closed") {
    return (
      <Card
        className="p-6 flex items-center gap-4"
        style={{
          background: "rgba(61,64,91,0.06)",
          border: "1px solid rgba(61,64,91,0.16)",
          color: "var(--text-muted)",
        }}
      >
        <Ban size={24} className="shrink-0" />
        <p className="text-sm font-bold">
          This queue is now closed. No new members are being accepted.
        </p>
      </Card>
    );
  }

  const canRejoinStatuses = ["left", "cancelled", "skipped", "completed"];

  // If user is already in queue
  if (userMember) {
    if (userMember.status === "waiting") {
      return (
        <Button
          fullWidth
          variant="danger"
          size="lg"
          className="h-16 rounded-[2rem]"
          onClick={onLeave}
          isLoading={leaving}
        >
          <LogOut size={20} className="mr-2" />
          Leave Queue
        </Button>
      );
    }

    if (canRejoinStatuses.includes(userMember.status)) {
      return (
        <Card
          className="flex flex-col gap-3 p-6 text-center"
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <p className="text-sm font-bold">
            You have {userMember.status} this queue.
          </p>
          <Button
            fullWidth
            size="lg"
            className="h-14 rounded-[2rem]"
            onClick={onJoin}
            isLoading={joining}
          >
            <LogIn size={18} className="mr-2" />
            Rejoin Queue
          </Button>
        </Card>
      );
    }

    if (userMember.status === "called") {
      return (
        <Card
          className="flex items-center gap-4 p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(129,178,154,0.95) 0%, rgba(61,64,91,0.88) 100%)",
            color: "#FFFFFF",
            border: "1px solid rgba(129,178,154,0.4)",
          }}
        >
          <AlertCircle size={24} className="shrink-0" />
          <div className="flex-1">
            <p className="font-black">It's Your Turn!</p>
            <p className="text-xs opacity-90">
              Please proceed to the counter immediately.
            </p>
          </div>
        </Card>
      );
    }

    return (
      <Card
        className="p-6 text-center font-bold text-sm"
        style={{
          background: "var(--surface-alt)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        Your status: {userMember.status}
      </Card>
    );
  }

  // Default: Join Queue
  return (
    <Button
      fullWidth
      size="lg"
      className="h-16 rounded-[2rem]"
      onClick={onJoin}
      isLoading={joining}
    >
      <LogIn size={20} className="mr-2" />
      Join Queue
    </Button>
  );
};

export default QueueActionPanel;
