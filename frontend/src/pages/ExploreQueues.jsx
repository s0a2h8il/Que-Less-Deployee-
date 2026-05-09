import React, { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, AlertTriangle, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useBusinesses } from "../hooks/useBusinesses";
import BusinessCard from "../components/business/BusinessCard";
import BusinessFilters from "../components/business/BusinessFilters";
import BusinessSearchBar from "../components/business/BusinessSearchBar";
import EmptyBusinessState from "../components/business/EmptyBusinessState";
import { Loader } from "../components";

const ExploreQueues = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialCity = searchParams.get("city") || "";

  const {
    businesses,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    pagination,
  } = useBusinesses({
    search: initialSearch,
    category: initialCategory,
    city: initialCity,
  });

  // Keep URL in sync with filters (skip the initial render)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    setSearchParams(params, { replace: true });
  }, [filters.search, filters.category, filters.city, setSearchParams]);

  const handleReset = () => setFilters({ search: "", category: "", city: "" });

  return (
    <div
      className="w-full"
      style={{ background: "var(--bg)", minHeight: "100vh" }}
    >
      {/* ── Hero Header ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--night-ink)] pt-20 md:pt-32 pb-20 md:pb-36">
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "-5%",
              width: 360,
              height: 360,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(58,160,255,0.10) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              right: "5%",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(242,179,61,0.06) 0%, transparent 70%)",
            }}
          />
        </div>
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(247,244,239,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(247,244,239,0.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5 whitespace-nowrap"
            style={{
              background: "rgba(58,160,255,0.10)",
              border: "1px solid rgba(58,160,255,0.22)",
              color: "#3AA0FF",
            }}
          >
            <SlidersHorizontal size={12} />
            Browse & Join
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.08,
            }}
            className="mb-4"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#F7F4EF",
            }}
          >
            Explore{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #3AA0FF, #F2B33D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Queues
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            style={{
              color: "rgba(247,244,239,0.48)",
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Find clinics, salons, and businesses near you — join their virtual
            queues instantly.
          </motion.p>
        </div>
      </section>

      {/* ── Control Deck (Search + Filters) ─────────────────── */}
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="relative -mt-10 rounded-3xl mb-10 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid rgba(61,64,91,0.08)",
            boxShadow:
              "0 20px 60px rgba(61,64,91,0.10), 0 2px 8px rgba(61,64,91,0.04)",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              height: 3,
              background:
                "linear-gradient(90deg, #81B29A, #3AA0FF, #F2CC8F, #E07A5F)",
              borderRadius: "3px 3px 0 0",
            }}
          />

          {/* Search Row */}
          <div
            className="px-5 md:px-8 pt-6 pb-4"
            style={{ borderBottom: "1px solid rgba(61,64,91,0.06)" }}
          >
            <BusinessSearchBar
              onSearch={setFilters}
              initialValue={filters.search}
            />
          </div>

          {/* Filters Row */}
          <div className="px-5 md:px-8 py-4">
            <BusinessFilters filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* ── Results ─────────────────────────────────────────── */}
        <section className="pb-24">
          {error ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(224, 122, 95, 0.08)" }}
              >
                <AlertTriangle size={28} style={{ color: "#E07A5F" }} />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--text-primary)",
                }}
              >
                Queues not found
              </h3>
              <p className="mb-6" style={{ color: "var(--text-muted)" }}>
                {error || "Failed to load queues. Please try again."}
              </p>
              <button
                onClick={refetch}
                className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap"
                style={{
                  background: "#81B29A",
                  color: "white",
                  fontFamily: "var(--font-heading)",
                  boxShadow: "0 4px 12px rgba(129, 178, 154, 0.15)",
                }}
              >
                <RefreshCcw
                  size={15}
                  className="group-hover:rotate-180 transition-transform duration-500"
                />
                Try Again
              </button>
            </div>
          ) : loading ? (
            /* Skeleton grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-72 rounded-2xl shimmer" />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <EmptyBusinessState onReset={handleReset} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {businesses.length}{" "}
                  {businesses.length === 1 ? "business" : "businesses"} found
                </p>
              </div>

              <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-6">
                {businesses.map((business, index) => (
                  <BusinessCard
                    key={`${business._id}-${index}`}
                    business={business}
                    index={index}
                  />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-14 flex justify-center">
                  <button
                    className="px-10 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      border: "1px solid var(--border-strong)",
                      color: "var(--text-secondary)",
                      background: "var(--surface)",
                      fontFamily: "var(--font-heading)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#3AA0FF";
                      e.currentTarget.style.color = "#3AA0FF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--border-strong)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ExploreQueues;
