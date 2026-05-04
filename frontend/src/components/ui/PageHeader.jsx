import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * PageHeader Component
 *
 * Consistent header for pages with title, description, and actions
 *
 * @param {string} title - Page title
 * @param {string} description - Page description (optional)
 * @param {React.ReactNode} icon - Icon component (optional)
 * @param {React.ReactNode} action - Action button/component (optional)
 * @param {boolean} showBack - Show back button (default: false)
 * @param {string} backTo - URL to go back to (if showBack is true)
 * @param {boolean} variant - 'light' or 'dark' (default: 'light')
 */
const PageHeader = ({
  title,
  description = null,
  icon: Icon = null,
  action = null,
  showBack = false,
  backTo = "/",
  variant = "light",
}) => {
  const navigate = useNavigate();

  const bgClasses = {
    light: "bg-white border-b border-slate-200",
    dark: "bg-slate-900 border-b border-slate-800 text-white",
  };

  const textClasses = {
    light: "text-slate-900",
    dark: "text-white",
  };

  const descClasses = {
    light: "text-slate-600",
    dark: "text-slate-400",
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${bgClasses[variant]} sticky top-16 z-20 py-6 sm:py-8`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Back + Title Section */}
          <div className="flex items-start gap-4 flex-1">
            {/* Back Button */}
            {showBack && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => navigate(backTo)}
                className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 mt-1 ${
                  variant === "dark"
                    ? "hover:bg-slate-800"
                    : "hover:bg-slate-100"
                }`}
                aria-label="Go back"
              >
                <ArrowLeft
                  size={20}
                  className={
                    variant === "dark" ? "text-white" : "text-slate-600"
                  }
                />
              </motion.button>
            )}

            {/* Icon + Title/Description */}
            <div className="flex items-start gap-3 flex-1">
              {/* Icon */}
              {Icon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-2 rounded-lg bg-blue-100/10 shrink-0 mt-1"
                >
                  <Icon
                    size={24}
                    className={
                      variant === "dark" ? "text-blue-400" : "text-blue-600"
                    }
                  />
                </motion.div>
              )}

              {/* Title & Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex-1"
              >
                <h1
                  className={`text-2xl sm:text-3xl font-bold ${textClasses[variant]}`}
                >
                  {title}
                </h1>

                {description && (
                  <p
                    className={`mt-1 sm:mt-2 text-sm sm:text-base ${descClasses[variant]}`}
                  >
                    {description}
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Right: Action */}
          {action && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="shrink-0"
            >
              {action}
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default PageHeader;
