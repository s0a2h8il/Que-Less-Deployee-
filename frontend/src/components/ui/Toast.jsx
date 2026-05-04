import React, { useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { ToastContext } from "../../context/ToastContext";

const Toasts = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="p-3 rounded-2xl shadow-md border flex items-start space-x-3"
          style={{
            background: "rgba(255,255,255,0.92)",
            borderColor: "rgba(61,64,91,0.10)",
          }}
        >
          <div className="flex-1">
            <div
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {t.title || t.type}
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {t.message}
            </div>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-sm hover:text-gray-900"
            style={{ color: "var(--text-muted)" }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

const Toast = ({
  isOpen,
  message,
  type = "info",
  onClose,
  duration = 4000,
}) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-100",
    error: "bg-red-50 border-red-100",
    warning: "bg-amber-50 border-amber-100",
    info: "bg-blue-50 border-blue-100",
  };

  useEffect(() => {
    if (!isOpen || duration <= 0) return undefined;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex min-w-[320px] items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-lg",
            bgColors[type],
          )}
          style={{ borderColor: "rgba(61,64,91,0.10)" }}
        >
          {icons[type]}
          <p
            className="flex-1 text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {message}
          </p>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-white/50 hover:text-slate-600"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Toast };

export default Toasts;
