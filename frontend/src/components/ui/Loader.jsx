import React from "react";

export const Loader = ({ size = "md" }) => {
  const sizeMap = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full ${sizeClass} border-t-2 border-b-2 border-[#E07A5F]`}
      />
    </div>
  );
};

export default Loader;
