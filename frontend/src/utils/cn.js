import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge tailwind classes with support for conditional classes
 * and conflict resolution.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
