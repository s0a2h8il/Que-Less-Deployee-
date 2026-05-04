import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary: {
    bg: "linear-gradient(135deg, #3D405B 0%, #4F5D75 100%)",
    text: "#FFFFFF",
    shadow: "rgba(61,64,91,0.22)",
    hover: "linear-gradient(135deg, #34384f 0%, #4b5870 100%)",
  },
  secondary: {
    bg: "rgba(255,255,255,0.78)",
    text: "var(--text-primary)",
    shadow: "rgba(61,64,91,0.08)",
    hover: "rgba(255,255,255,0.92)",
  },
  outline: {
    bg: "transparent",
    text: "var(--text-primary)",
    shadow: "transparent",
    hover: "var(--surface-alt)",
  },
  ghost: {
    bg: "transparent",
    text: "var(--text-secondary)",
    shadow: "transparent",
    hover: "var(--surface-alt)",
  },
  danger: {
    bg: "#E07A5F",
    text: "#FFFFFF",
    shadow: "rgba(224,122,95,0.30)",
    hover: "#d86a52",
  },
  success: {
    bg: "#81B29A",
    text: "#FFFFFF",
    shadow: "rgba(129,178,154,0.26)",
    hover: "#6fa087",
  },
  warning: {
    bg: "#F2CC8F",
    text: "#3D405B",
    shadow: "rgba(242,204,143,0.28)",
    hover: "#ebb971",
  },
  info: {
    bg: "rgba(190,227,248,0.88)",
    text: "#3D405B",
    shadow: "rgba(190,227,248,0.24)",
    hover: "rgba(190,227,248,1)",
  },
};

const sizes = {
  sm: { h: "h-8", px: "px-3", text: "text-xs", gap: "gap-1.5" },
  md: { h: "h-10", px: "px-5", text: "text-sm", gap: "gap-2" },
  lg: { h: "h-13", px: "px-7", text: "text-base", gap: "gap-2.5" },
};

const Button = React.forwardRef(
  (
    {
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
    },
    ref,
  ) => {
    const v = variants[variant] || variants.primary;
    const s = sizes[size] || sizes.md;
    const isDisabled = disabled || isLoading;

    const baseStyle = {
      background: v.bg,
      color: v.text,
      boxShadow: v.shadow !== "transparent" ? `0 4px 14px ${v.shadow}` : "none",
      border:
        variant === "outline"
          ? "1.5px solid var(--border-strong)"
          : "1px solid rgba(61,64,91,0.08)",
      fontFamily: "var(--font-heading)",
      letterSpacing: "-0.01em",
      transition: "all 220ms var(--ease-out-expo)",
      ...style,
    };

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={
          !isDisabled ? { y: -1, boxShadow: `0 8px 24px ${v.shadow}` } : {}
        }
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.18 }}
        style={baseStyle}
        className={cn(
          "inline-flex flex-nowrap items-center justify-center whitespace-nowrap rounded-2xl font-semibold transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D405B]",
          "disabled:opacity-45 disabled:pointer-events-none",
          s.h,
          s.px,
          s.text,
          s.gap,
          fullWidth ? "w-full" : "",
          className,
        )}
        {...props}
      >
        {isLoading && (
          <Loader2
            className="animate-spin"
            size={size === "lg" ? 18 : size === "sm" ? 14 : 16}
          />
        )}
        {!isLoading && leftIcon && (
          <span className="flex shrink-0 items-center justify-center">
            {leftIcon}
          </span>
        )}
        {children && <span className="leading-none">{children}</span>}
        {!isLoading && rightIcon && (
          <span className="flex shrink-0 items-center justify-center">
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
export { Button };
