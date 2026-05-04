import React from "react";
import { cn } from "../../utils/cn";

const Card = ({ className, children, ...props }) => (
  <div
    className={cn("ql-card", className)}
    {...props}
  >
    {children}
  </div>
);

export { Card };
