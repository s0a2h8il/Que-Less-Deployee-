import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, BadgeCheck, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

// Category → gradient map for the card header
const CATEGORY_GRADIENTS = {
  healthcare: "from-[#3AA0FF]/20 to-[#2888e8]/10",
  clinic: "from-[#3AA0FF]/20 to-[#2888e8]/10",
  salon: "from-[#EA526F]/15 to-[#F2B33D]/10",
  food: "from-[#F2B33D]/20 to-[#EA526F]/10",
  restaurant: "from-[#F2B33D]/20 to-[#EA526F]/10",
  retail: "from-[#3AA0FF]/15 to-[#EA526F]/10",
  testing: "from-[#EA526F]/15 to-[#3AA0FF]/10",
  default: "from-[#3AA0FF]/12 to-[#F2B33D]/08",
};

const getGradient = (category = "") =>
  CATEGORY_GRADIENTS[category.toLowerCase()] || CATEGORY_GRADIENTS.default;

const BusinessCard = ({ business, index }) => {
  const {
    name,
    category,
    city,
    address,
    rating,
    isVerified,
    isActive,
    activeQueueId,
  } = business;

  const avatarChar = (
    name?.trim()?.[0] ||
    category?.trim()?.[0] ||
    "?"
  ).toUpperCase();
  const hasActiveQueue = Boolean(activeQueueId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4 }}
      style={{ height: "100%" }}
    >
      <div
        className="group h-full flex flex-col overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "1.25rem",
          boxShadow: "var(--shadow-sm)",
          transition: "box-shadow 240ms var(--ease-out-expo)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          e.currentTarget.style.borderColor = "rgba(58,160,255,0.20)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        {/* ── Card Header ─────────────────────────────────────── */}
        <div
          className={cn(
            "relative h-28 overflow-visible bg-gradient-to-br",
            getGradient(category),
          )}
          style={{ background: undefined }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 70% 30%, rgba(58,160,255,0.08) 0%, transparent 60%)`,
            }}
          />

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            {isActive && hasActiveQueue ? (
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(34,197,94,0.12)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Live Queue
              </span>
            ) : !isActive ? (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(156,163,175,0.12)",
                  color: "#9CA3AF",
                  border: "1px solid rgba(156,163,175,0.20)",
                }}
              >
                Closed
              </span>
            ) : (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: "rgba(242,179,61,0.12)",
                  color: "#F2B33D",
                  border: "1px solid rgba(242,179,61,0.25)",
                }}
              >
                No Active Queue
              </span>
            )}
          </div>

          {/* Category avatar */}
          <div
            className="absolute -bottom-5 left-5 z-10 h-11 w-11 rounded-xl flex items-center justify-center font-bold text-[16px] leading-none shadow-md"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "#3AA0FF",
              fontFamily: "var(--font-heading)",
            }}
          >
            {avatarChar}
          </div>
        </div>

        {/* ── Card Body ────────────────────────────────────────── */}
        <div className="p-5 pt-9 flex-1 flex flex-col">
          {/* Name + verified */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className="text-base font-bold leading-snug group-hover:text-[#3AA0FF] transition-colors"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
              }}
            >
              {name}
            </h3>
            {isVerified && (
              <BadgeCheck
                size={18}
                className="shrink-0 mt-0.5"
                style={{ color: "#3AA0FF" }}
                fill="rgba(58,160,255,0.12)"
              />
            )}
          </div>

          {/* Category */}
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: "#3AA0FF" }}
          >
            {category}
          </p>

          {/* Location */}
          <div
            className="flex items-center gap-1.5 mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            <MapPin size={13} className="shrink-0" />
            <span className="text-[13px] truncate">
              {address}, {city}
            </span>
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-4">
              <Star size={13} style={{ color: "#F2B33D" }} fill="#F2B33D" />
              <span
                className="text-sm font-bold"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {rating}
              </span>
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-auto">
            {isActive && hasActiveQueue ? (
              <Link
                to={`/queue/${activeQueueId}`}
                className="group/btn relative block overflow-hidden rounded-xl"
                style={{ textDecoration: "none" }}
              >
                {/* Gradient background */}
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #3AA0FF 0%, #2888e8 100%)",
                  }}
                />
                {/* Shimmer sweep */}
                <div
                  className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                    transform: "translateX(-100%)",
                  }}
                />
                <div
                  className="relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold"
                  style={{
                    color: "#0B1320",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  <span>View Queues</span>
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </div>
              </Link>
            ) : (
              <div
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold select-none cursor-not-allowed"
                style={{
                  background: "var(--surface-alt)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                {isActive ? "No Active Queue" : "Closed"}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusinessCard;
