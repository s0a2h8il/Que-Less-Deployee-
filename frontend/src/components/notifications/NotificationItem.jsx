import React from "react";
import { 
  Bell, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  PauseCircle, 
  PlayCircle, 
  XCircle,
  ArrowRightLeft,
  User,
  Info
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../../utils/cn";

const NotificationItem = ({ notification, onClick, onDelete }) => {
  const { title, message, type, createdAt, isRead } = notification;

  const config = {
    turn_near: { icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    turn_called: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    queue_paused: { icon: PauseCircle, color: "text-slate-500", bg: "bg-slate-50" },
    queue_resumed: { icon: PlayCircle, color: "text-blue-500", bg: "bg-blue-50" },
    queue_closed: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    exchange_request: { icon: ArrowRightLeft, color: "text-indigo-500", bg: "bg-indigo-50" },
    exchange_accepted: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    exchange_rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    system: { icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
    default: { icon: Bell, color: "text-slate-500", bg: "bg-slate-50" }
  };

  const { icon: Icon, color, bg } = config[type] || config.default;

  return (
    <div 
      onClick={() => onClick && onClick(notification)}
      className={cn(
        "p-4 flex gap-4 cursor-pointer transition-all hover:bg-slate-50 relative group",
        !isRead && "bg-indigo-50/30 hover:bg-indigo-50/50"
      )}
    >
      {!isRead && (
        <div className="absolute top-4 left-1 w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
      )}

      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm", bg, color)}>
        <Icon size={22} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className={cn("font-bold text-sm truncate pr-2", isRead ? "text-slate-700" : "text-slate-900")}>
            {title}
          </h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter shrink-0 mt-0.5">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className={cn("text-xs leading-relaxed line-clamp-2", isRead ? "text-slate-500" : "text-slate-600 font-medium")}>
          {message}
        </p>
      </div>
      
      {onDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
          className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg"
        >
          <XCircle size={14} />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
