import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary:   { bg: "#3AA0FF",  text: "#0B1320",  shadow: "rgba(58,160,255,0.35)", hover: "#2888e8" },
  secondary: { bg: "#1F2937",  text: "#F7F4EF",  shadow: "transparent",           hover: "#2d3f52" },
  outline:   { bg: "transparent", text: "var(--text-secondary)", shadow: "transparent", hover: "var(--surface-alt)" },
  ghost:     { bg: "transparent", text: "var(--text-secondary)", shadow: "transparent", hover: "var(--surface-alt)" },
  danger:    { bg: "#EA526F",  text: "#FFFFFF",  shadow: "rgba(234,82,111,0.35)", hover: "#d44462" },
  success:   { bg: "#22c55e",  text: "#FFFFFF",  shadow: "rgba(34,197,94,0.30)",  hover: "#16a34a" },
  warning:   { bg: "#F2B33D",  text: "#0B1320",  shadow: "rgba(242,179,61,0.30)", hover: "#e0a330" },
  info:      { bg: "#1F2937",  text: "#3AA0FF",  shadow: "transparent",           hover: "#2d3f52" },
};

const sizes = {
  sm: { h: "h-8",  px: "px-3",  text: "text-xs",  gap: "gap-1.5" },
  md: { h: "h-10", px: "px-5",  text: "text-sm",  gap: "gap-2"   },
  lg: { h: "h-13", px: "px-7",  text: "text-base", gap: "gap-2.5" },
};

const Button = React.forwardRef(({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  style,
  ...props
}, ref) => {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  const isDisabled = disabled || isLoading;

  const baseStyle = {
    background: v.bg,
    color: v.text,
    boxShadow: v.shadow !== "transparent" ? `0 4px 14px ${v.shadow}` : "none",
    border: variant === "outline" ? "1.5px solid var(--border-strong)" : "none",
    fontFamily: "var(--font-heading)",
    letterSpacing: "-0.01em",
    transition: "all 220ms var(--ease-out-expo)",
    ...style,
  };

  return (
    <motion.button
      ref={ref}
      disabled={isDisabled}
      whileHover={!isDisabled ? { y: -1, boxShadow: `0 6px 20px ${v.shadow}` } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.18 }}
      style={baseStyle}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3AA0FF]",
        "disabled:opacity-45 disabled:pointer-events-none",
        s.h, s.px, s.text, s.gap,
        fullWidth ? "w-full" : "",
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={size === "lg" ? 18 : size === "sm" ? 14 : 16} />}
      {!isLoading && leftIcon  && <span className="flex items-center justify-center">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="flex items-center justify-center">{rightIcon}</span>}
    </motion.button>
  );
});

Button.displayName = "Button";
export { Button };
