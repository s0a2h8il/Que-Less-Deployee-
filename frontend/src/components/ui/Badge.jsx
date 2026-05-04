import React from "react";
import { cn } from "../../utils/cn";

/**
 * Badge Component
 *
 * Reusable badge for status, labels, and tags
 *
 * @param {string} variant - 'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {React.ReactNode} icon - Icon component (optional)
 * @param {React.ReactNode} children - Badge content
 */
const Badge = ({
  variant = "default",
  size = "md",
  icon: Icon = null,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center gap-1.5 font-semibold rounded-full transition-colors whitespace-nowrap";

  const variantClasses = {
    default: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    primary: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    secondary: "bg-teal-100 text-teal-700 hover:bg-teal-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    warning: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200",
    info: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    dark: "bg-slate-700 text-white hover:bg-slate-800",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {Icon && <Icon size={size === "lg" ? 18 : size === "md" ? 16 : 14} />}
      <span>{props.children}</span>
    </span>
  );
};

/**
 * Status Badge
 * Predefined badges for common status values
 */
const StatusBadge = ({ status, size = "md" }) => {
  const statusConfig = {
    active: { variant: "success", label: "Active" },
    inactive: { variant: "default", label: "Inactive" },
    paused: { variant: "warning", label: "Paused" },
    closed: { variant: "danger", label: "Closed" },
    pending: { variant: "info", label: "Pending" },
    approved: { variant: "success", label: "Approved" },
    rejected: { variant: "danger", label: "Rejected" },
    completed: { variant: "success", label: "Completed" },
    waiting: { variant: "info", label: "Waiting" },
    left: { variant: "warning", label: "Left" },
    skipped: { variant: "default", label: "Skipped" },
    verified: { variant: "success", label: "Verified" },
    unverified: { variant: "warning", label: "Unverified" },
    online: { variant: "success", label: "Online" },
    offline: { variant: "default", label: "Offline" },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};

/**
 * Badge Group
 * Display multiple badges in a row
 */
const BadgeGroup = ({
  items,
  variant = "default",
  size = "md",
  maxItems = null,
}) => {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  const remainingCount =
    maxItems && items.length > maxItems ? items.length - maxItems : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayItems.map((item, idx) => (
        <Badge key={idx} variant={variant} size={size}>
          {item}
        </Badge>
      ))}

      {remainingCount > 0 && (
        <Badge variant="outline" size={size}>
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
};

export { Badge, StatusBadge, BadgeGroup };
export default Badge;
