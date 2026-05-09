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
              "peer flex h-11 w-full rounded-2xl border-2 border-slate-200 bg-white/90 px-3.5 py-2 text-sm transition-all duration-500 ease-out outline-none shadow-[0_8px_20px_rgba(61,64,91,0.04)] ring-2 ring-transparent ring-offset-2 ring-offset-white",
              "hover:border-slate-300 hover:bg-white",
              "focus:border-[#0B1320] focus:bg-white focus:ring-[#0B1320]",
              Icon && "pl-11",
              error && "!border-rose-500 focus:!ring-rose-500",
              className,
            )}
            style={{
              color: "var(--text-primary)",
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
