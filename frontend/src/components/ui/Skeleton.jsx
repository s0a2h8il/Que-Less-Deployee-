import React from "react";
import { cn } from "../../utils/cn";

/**
 * Base Skeleton Component
 * Animated placeholder for loading states
 */
const Skeleton = ({ className, ...props }) => (
  <div
    className={cn(
      "bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg",
      "animate-pulse",
      className,
    )}
    {...props}
  />
);

/**
 * Card Skeleton
 * Shows skeleton for a card component
 */
const CardSkeleton = ({ count = 1 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border border-slate-200 p-4 space-y-4">
        <Skeleton className="h-4 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <Skeleton className="h-8 w-1/4 rounded-lg" />
      </div>
    ))}
  </div>
);

/**
 * Table Skeleton
 * Shows skeleton for a table component
 */
const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="p-3">
              <Skeleton className="h-4 w-full" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx} className="border-t border-slate-200">
            {Array.from({ length: cols }).map((_, colIdx) => (
              <td key={colIdx} className="p-3">
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * List Skeleton
 * Shows skeleton for a list component
 */
const ListSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200"
      >
        {/* Avatar */}
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />

        {/* Content */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Action */}
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    ))}
  </div>
);

/**
 * Dashboard Skeleton
 * Shows skeleton for dashboard grid layout
 */
const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 p-4 space-y-3"
        >
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>

    {/* Charts/Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 p-4 space-y-4"
        >
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      ))}
    </div>

    {/* Table */}
    <div className="rounded-lg border border-slate-200 p-4">
      <TableSkeleton rows={5} cols={4} />
    </div>
  </div>
);

/**
 * Chart Skeleton
 * Shows skeleton for chart component
 */
const ChartSkeleton = () => (
  <div className="rounded-lg border border-slate-200 p-4 space-y-4">
    <Skeleton className="h-4 w-1/3" />
    <div className="flex items-center justify-center h-64">
      <div className="w-full h-full flex items-center justify-center">
        <div className="space-y-2 w-full px-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Queue Card Skeleton
 * Specific skeleton for queue cards
 */
const QueueCardSkeleton = ({ count = 1 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border border-slate-200 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>

        {/* Info */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* Action */}
        <Skeleton className="h-8 w-full" />
      </div>
    ))}
  </div>
);

export {
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ListSkeleton,
  DashboardSkeleton,
  ChartSkeleton,
  QueueCardSkeleton,
};

export default Skeleton;
