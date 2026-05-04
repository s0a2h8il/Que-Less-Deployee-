import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { Button } from "./Button";

/**
 * ConfirmDialog Component
 *
 * Reusable confirmation dialog for destructive or important actions
 *
 * @param {boolean} isOpen - Dialog visibility
 * @param {function} onClose - Close callback
 * @param {function} onConfirm - Confirm callback
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmLabel - Confirm button label (default: "Confirm")
 * @param {string} cancelLabel - Cancel button label (default: "Cancel")
 * @param {string} variant - Button variant: 'danger', 'warning', 'primary' (default: 'danger')
 * @param {boolean} isDangerous - Show warning styling (default: false)
 * @param {boolean} loading - Show loading state on confirm button
 */
const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isDangerous = false,
  loading = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleConfirm = async () => {
    await onConfirm?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors z-10"
                aria-label="Close dialog"
              >
                <X size={20} className="text-slate-600" />
              </button>

              {/* Content */}
              <div
                className={`p-6 ${isDangerous ? "bg-red-50/50 border-t-4 border-red-500" : ""}`}
              >
                {/* Icon */}
                {isDangerous && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100"
                  >
                    <AlertCircle size={24} className="text-red-600" />
                  </motion.div>
                )}

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isDangerous ? 0.15 : 0 }}
                  className={`text-xl font-semibold mb-2 ${isDangerous ? "text-red-900" : "text-slate-900"}`}
                >
                  {title}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: isDangerous ? 0.2 : 0.05 }}
                  className="text-slate-600 mb-6"
                >
                  {message}
                </motion.p>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isDangerous ? 0.25 : 0.1 }}
                  className="flex gap-3"
                >
                  {/* Cancel Button */}
                  <Button
                    variant="outline"
                    size="md"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    {cancelLabel}
                  </Button>

                  {/* Confirm Button */}
                  <Button
                    variant={variant}
                    size="md"
                    onClick={handleConfirm}
                    loading={loading}
                    className="flex-1"
                  >
                    {confirmLabel}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
