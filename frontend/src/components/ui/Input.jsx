import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(
  ({ className, label, error, icon: Icon, fullWidth, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
        {label && (
          <label
            className="text-sm font-medium ml-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && (
            <div
              className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-2xl border px-3.5 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50",
              Icon && "pl-11",
              error && "focus-visible:ring-rose-500/20",
              className,
            )}
            style={{
              background: "rgba(255,255,255,0.84)",
              borderColor: error ? "#E07A5F" : "rgba(61,64,91,0.12)",
              color: "var(--text-primary)",
              boxShadow: "0 8px 20px rgba(61,64,91,0.04)",
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-medium ml-1" style={{ color: "#E07A5F" }}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
