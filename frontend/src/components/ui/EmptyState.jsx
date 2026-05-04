import React from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";

/**
 * EmptyState Component
 *
 * Reusable component for displaying empty states across the app
 *
 * @param {string} icon - Lucide icon component (not string)
 * @param {string} title - Empty state title
 * @param {string} description - Empty state description
 * @param {Object} action - Action button config {label, onClick, variant}
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action = null,
  size = "md",
}) => {
  const sizeClasses = {
    sm: { container: "py-8", icon: 48, title: "text-lg", desc: "text-sm" },
    md: { container: "py-16", icon: 64, title: "text-2xl", desc: "text-base" },
    lg: { container: "py-24", icon: 80, title: "text-3xl", desc: "text-lg" },
  };

  const config = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center ${config.container} text-center`}
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Icon
            size={config.icon}
            className="text-slate-300 mx-auto"
            strokeWidth={1.5}
          />
        </motion.div>
      )}

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={`${config.title} font-semibold text-slate-700 mb-2`}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`${config.desc} text-slate-500 max-w-md mb-6`}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Button
            variant={action.variant || "primary"}
            size={size === "lg" ? "lg" : "md"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
