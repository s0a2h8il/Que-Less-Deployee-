import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import AnimatedQueuePreview from "./AnimatedQueuePreview";

const HeroSection = () => {
  const palette = {
    cream: "#FFF7EA",
    sand: "#F2CC8F",
    peach: "#E07A5F",
    mint: "#81B29A",
    ink: "#3D405B",
    sky: "#BEE3F8",
  };

  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55 },
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75 },
        "-=0.35",
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55 },
        "-=0.35",
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.5 },
        "-=0.35",
      )
      .fromTo(
        statsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.2",
      );
  }, []);

  return (
    <section
      className="relative bg-pattern overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,247,234,1) 0%, rgba(255,242,221,1) 38%, rgba(231,251,243,1) 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "5rem", 
        paddingBottom: "3rem",
      }}
    >
      {/* Background radial blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(224,122,95,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-8%",
            right: "-5%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(129,178,154,0.26) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,64,91,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61,64,91,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative container mx-auto px-6">
        <div className="flex flex-col items-center lg:flex-row lg:gap-8">
          {/* ── Left ─────────────────────────────────────── */}
          <div className="flex-[0.9] text-center lg:text-left">
            {/* Badge */}
            <div
              ref={badgeRef}
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap"
              style={{
                background: "rgba(255,255,255,0.74)",
                border: "1px solid rgba(61,64,91,0.12)",
                color: palette.ink,
                fontFamily: "var(--font-body)",
                boxShadow: "0 12px 24px rgba(61,64,91,0.06)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                style={{ background: palette.mint }}
              />
              Virtual Queue Management Platform
            </div>

            {/* Headline */}
            <h1
              ref={titleRef}
              className="mb-5"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: palette.ink,
              }}
            >
              Skip the Line.{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 55%, #81B29A 100%)",
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
              className="mb-8 max-w-lg"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "rgba(61,64,91,0.78)",
                marginLeft: "0",
                marginRight: "auto",
              }}
            >
              QueueLess helps businesses create a calmer queue experience, while
              customers enjoy clear updates and smoother flow from phone to counter.
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="mb-12 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <Link to="/explore">
                <button
                  className="group relative overflow-hidden px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #3D405B 0%, #4F5D75 100%)",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-heading)",
                    boxShadow: "0 12px 28px rgba(61,64,91,0.24)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 16px 34px rgba(61,64,91,0.30)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 12px 28px rgba(61,64,91,0.24)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span className="relative z-10">Join a Queue</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </button>
              </Link>
              <Link to="/business">
                <button
                  className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.70)",
                    color: palette.ink,
                    border: "1px solid rgba(61,64,91,0.12)",
                    fontFamily: "var(--font-heading)",
                    boxShadow: "0 10px 22px rgba(61,64,91,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(61,64,91,0.24)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.92)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(61,64,91,0.12)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.70)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  For Business
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex flex-wrap justify-center gap-6 pt-6 lg:justify-start lg:gap-10"
              style={{ borderTop: "1px solid rgba(61,64,91,0.10)" }}
            >
              <StatItem value="10k+" label="Spots Saved" />
              <StatItem value="35%" label="Wait Reduced" />
              <StatItem value="24/7" label="Live Tracking" />
            </div>
          </div>

          {/* ── Right: Animated Preview ──────────────────── */}
          <div
            className="mt-12 flex-1 lg:mt-0 flex justify-center lg:justify-end"
            style={{ padding: "1rem" }}
          >
            <div className="scale-90 lg:scale-95 transition-transform origin-center">
              <AnimatedQueuePreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ value, label }) => (
  <div className="text-center lg:text-left">
    <div
      className="text-2xl font-black"
      style={{
        fontFamily: "var(--font-heading)",
        color: "#3D405B",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </div>
    <div
      className="text-[11px] font-bold uppercase tracking-widest"
      style={{ color: "rgba(61,64,91,0.58)", fontFamily: "var(--font-body)" }}
    >
      {label}
    </div>
  </div>
);

export default HeroSection;
