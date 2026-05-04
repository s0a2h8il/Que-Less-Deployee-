import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "./Button";

/**
 * ErrorState Component
 *
 * Reusable component for displaying error states
 *
 * @param {string} title - Error title
 * @param {string} message - Error message/description
 * @param {Object} action - Primary action {label, onClick, variant}
 * @param {Object} backAction - Secondary action {label, onClick}
 * @param {string} errorCode - HTTP error code (404, 500, etc.)
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 */
const ErrorState = ({
  title = "Something went wrong",
  message = "Please try again or contact support if the problem persists.",
  action = null,
  backAction = null,
  errorCode = null,
  size = "md",
}) => {
  const sizeClasses = {
    sm: { container: "py-8", icon: 48, title: "text-lg", desc: "text-sm" },
    md: { container: "py-16", icon: 64, title: "text-2xl", desc: "text-base" },
    lg: { container: "py-24", icon: 80, title: "text-3xl", desc: "text-lg" },
  };

  const config = sizeClasses[size];

  // Map common error codes to messages
  const errorMessages = {
    404: "Page or resource not found",
    403: "You don't have permission to access this",
    401: "Please log in to continue",
    500: "Server error. Please try again later",
    timeout: "Request timed out. Please check your connection",
  };

  const displayMessage =
    message || errorMessages[errorCode] || errorMessages[500];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center ${config.container} text-center bg-red-50/50 rounded-lg p-6 border border-red-200/50`}
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-red-100/20 rounded-full blur-lg" />
          <AlertCircle
            size={config.icon}
            className="text-red-600 relative"
            strokeWidth={1.5}
          />
        </div>
      </motion.div>

      {/* Error Code */}
      {errorCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="mb-2"
        >
          <span className="text-xs font-semibold text-red-600 bg-red-100/50 px-3 py-1 rounded-full">
            Error {errorCode}
          </span>
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={`${config.title} font-semibold text-slate-900 mb-2`}
      >
        {title}
      </motion.h3>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`${config.desc} text-slate-600 max-w-md mb-6`}
      >
        {displayMessage}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center"
      >
        {/* Primary Action (Retry) */}
        {action && (
          <Button
            variant={action.variant || "primary"}
            size={size === "lg" ? "lg" : "md"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}

        {/* Secondary Action (Go Back) */}
        {backAction && (
          <Button
            variant="outline"
            size={size === "lg" ? "lg" : "md"}
            onClick={backAction.onClick}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            {backAction.label}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ErrorState;
