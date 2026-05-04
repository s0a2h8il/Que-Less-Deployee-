import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(
  ({ className, label, error, icon: Icon, fullWidth, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
        {label && (
          <label className="text-sm font-medium text-slate-700 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all disabled:cursor-not-allowed disabled:opacity-50",
              Icon && "pl-11",
              error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
