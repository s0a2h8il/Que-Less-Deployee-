import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import AnimatedQueuePreview from "./AnimatedQueuePreview";

const HeroSection = () => {
  const badgeRef  = useRef(null);
  const titleRef  = useRef(null);
  const subRef    = useRef(null);
  const ctaRef    = useRef(null);
  const statsRef  = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(badgeRef.current,  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 })
      .fromTo(titleRef.current,  { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.75 }, "-=0.35")
      .fromTo(subRef.current,    { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.35")
      .fromTo(ctaRef.current,    { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.50 }, "-=0.35")
      .fromTo(statsRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.2");
  }, []);

  return (
    <section
      className="relative bg-pattern"
      style={{
        background: "var(--night-ink)",
        paddingTop: "clamp(5rem, 10vw, 8rem)",
        paddingBottom: "clamp(6rem, 12vw, 10rem)",
      }}
    >
      {/* Background radial blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "-10%", left: "-5%",  width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,160,255,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-8%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,179,61,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "30%",   right: "15%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,82,111,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(247,244,239,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(247,244,239,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative container mx-auto px-6">
        <div className="flex flex-col items-center lg:flex-row lg:gap-16">

          {/* ── Left ─────────────────────────────────────── */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div
              ref={badgeRef}
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(58,160,255,0.10)",
                border: "1px solid rgba(58,160,255,0.25)",
                color: "#3AA0FF",
                fontFamily: "var(--font-body)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3AA0FF] animate-pulse inline-block" />
              Virtual Queue Management Platform
            </div>

            {/* Headline */}
            <h1
              ref={titleRef}
              className="mb-7"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "#F7F4EF",
              }}
            >
              Skip the Line.{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #3AA0FF 0%, #F2B33D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Keep Your Spot.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subRef}
              className="mb-10 max-w-xl"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.125rem",
                lineHeight: 1.75,
                color: "rgba(247,244,239,0.55)",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              QueueLess empowers businesses and customers with real-time virtual queueing.
              Join queues from your phone and get notified when it's your turn.
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="mb-16 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Link to="/explore">
                <button
                  className="group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300"
                  style={{
                    background: "#3AA0FF",
                    color: "#0B1320",
                    fontFamily: "var(--font-heading)",
                    boxShadow: "0 6px 24px rgba(58,160,255,0.40)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(58,160,255,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(58,160,255,0.40)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <span className="relative z-10">Join a Queue</span>
                  {/* shimmer */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </button>
              </Link>
              <Link to="/business">
                <button
                  className="px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300"
                  style={{
                    background: "transparent",
                    color: "rgba(247,244,239,0.70)",
                    border: "1px solid rgba(247,244,239,0.18)",
                    fontFamily: "var(--font-heading)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(58,160,255,0.40)"; e.currentTarget.style.color = "#3AA0FF"; e.currentTarget.style.background = "rgba(58,160,255,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(247,244,239,0.18)"; e.currentTarget.style.color = "rgba(247,244,239,0.70)"; e.currentTarget.style.background = "transparent"; }}
                >
                  For Business
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex flex-wrap justify-center gap-8 pt-8 lg:justify-start lg:gap-12"
              style={{ borderTop: "1px solid rgba(247,244,239,0.08)" }}
            >
              <StatItem value="10k+" label="Spots Saved" />
              <StatItem value="35%"  label="Wait Reduced" />
              <StatItem value="24/7" label="Live Tracking" />
            </div>
          </div>

          {/* ── Right: Animated Preview ──────────────────── */}
          {/* The outer padding gives the floating badges room (-top-10 / -bottom-8 / -left-10 / -right-4) */}
          <div className="mt-20 flex-1 lg:mt-0" style={{ padding: "3rem 1.5rem 3rem 3rem" }}>
            <AnimatedQueuePreview />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ value, label }) => (
  <div className="text-center lg:text-left">
    <div
      className="text-3xl font-black"
      style={{ fontFamily: "var(--font-heading)", color: "#F7F4EF", letterSpacing: "-0.02em" }}
    >
      {value}
    </div>
    <div className="text-sm font-medium" style={{ color: "rgba(247,244,239,0.45)", fontFamily: "var(--font-body)" }}>
      {label}
    </div>
  </div>
);

export default HeroSection;
