import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle2, TrendingUp, Monitor, Users, Zap, Clock, BarChart3 } from "lucide-react";

const BusinessCTA = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const palette = {
    cream: "#FFF7EA",
    sand: "#F2CC8F",
    peach: "#E07A5F",
    mint: "#81B29A",
    ink: "#3D405B",
    sky: "#BEE3F8",
  };

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-[2rem] border p-6 sm:p-8 lg:rounded-[3rem] lg:p-14"
          style={{
            borderColor: "rgba(61,64,91,0.12)",
            background:
              "linear-gradient(145deg, rgba(255,247,234,1) 0%, rgba(255,240,215,1) 36%, rgba(231,251,243,1) 100%)",
            boxShadow: "0 24px 64px rgba(61,64,91,0.12)",
          }}
        >
          <div
            className="pointer-events-none absolute -left-24 top-0 h-60 w-60 rounded-full blur-3xl"
            style={{ background: "rgba(224,122,95,0.24)" }}
          />
          <div
            className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "rgba(129,178,154,0.3)" }}
          />
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute left-1/2 top-10 h-24 w-24 rounded-full blur-2xl"
            style={{ background: "rgba(190,227,248,0.55)" }}
          />
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, 8, 0], x: [0, -8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute bottom-10 right-1/4 h-20 w-20 rounded-full blur-2xl"
            style={{ background: "rgba(242,204,143,0.45)" }}
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <div>
              <motion.div
                initial={{ y: 14, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] whitespace-nowrap"
                style={{
                  color: palette.ink,
                  borderColor: "rgba(61,64,91,0.18)",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: palette.mint }}
                />
                Built For Growing Teams
              </motion.div>

              <h2
                className="mb-5 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl"
                style={{ color: palette.ink }}
              >
                Run your business queue
                <span className="block" style={{ color: palette.peach }}>
                  smarter, calmer, brighter.
                </span>
              </h2>

              <p
                className="mb-8 max-w-xl text-base leading-8 sm:text-lg"
                style={{ color: "rgba(61,64,91,0.85)" }}
              >
                Whether you run a clinic, salon, or restaurant, QueueLess helps
                you reduce crowd stress and create a smoother waiting experience
                that people actually enjoy.
              </p>

              <div
                className="mb-8 inline-flex max-w-xl items-center gap-3 rounded-2xl border px-4 py-3 sm:px-5"
                style={{
                  borderColor: "rgba(61,64,91,0.10)",
                  background: "rgba(255,255,255,0.72)",
                  boxShadow: "0 12px 24px rgba(61,64,91,0.06)",
                }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(129,178,154,0.18)",
                    color: palette.ink,
                  }}
                >
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: palette.ink }}
                  >
                    Less waiting. More relief.
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(61,64,91,0.72)" }}
                  >
                    The moment people feel seen, the whole queue feels better.
                  </p>
                </div>
              </div>

              <div className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <BusinessFeature
                  icon={Monitor}
                  text="Admin Dashboard"
                  palette={palette}
                />
                <BusinessFeature
                  icon={CheckCircle2}
                  text="Instant Setup"
                  palette={palette}
                />
                <BusinessFeature
                  icon={TrendingUp}
                  text="Growth Analytics"
                  palette={palette}
                />
                <BusinessFeature
                  icon={CheckCircle2}
                  text="Unlimited Queues"
                  palette={palette}
                />
              </div>

              <Link to={isAdmin ? "/admin/dashboard" : "/register"}>
                <Button
                  size="lg"
                  className="h-14 rounded-2xl border-none px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] sm:h-16 sm:px-10 sm:text-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #3D405B 0%, #4F5D75 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 16px 34px rgba(61,64,91,0.26)",
                  }}
                >
                  {isAdmin ? "Manage My Queues" : "Create Business Queue"}
                </Button>
              </Link>

              <div
                className="mt-4 flex flex-wrap items-center gap-3 text-sm"
                style={{ color: "rgba(61,64,91,0.72)" }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 ring-1 ring-black/5 whitespace-nowrap">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: palette.mint }}
                  />
                  Feels calm in seconds
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 ring-1 ring-black/5 whitespace-nowrap">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: palette.peach }}
                  />
                  Works beautifully on mobile
                </span>
              </div>
            </div>

            <motion.div
              initial={{ x: 70, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="w-full"
            >
                <div
                  className="relative mx-auto flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem]"
                  style={{
                    background: "linear-gradient(170deg, #ffffff 0%, #f0faf4 40%, #fef9f0 100%)",
                    boxShadow: "0 28px 64px rgba(61,64,91,0.10), 0 0 0 1px rgba(255,255,255,0.7) inset",
                    border: "1px solid rgba(61,64,91,0.07)",
                    minHeight: 440,
                  }}
                >
                  {/* Digital Network Grid */}
                  <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{ 
                      backgroundImage: "radial-gradient(circle at 2px 2px, #3D405B 1px, transparent 0)",
                      backgroundSize: "24px 24px" 
                    }} 
                  />

                  {/* Rotating Energy Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute h-[340px] w-[340px] rounded-full border border-dashed border-mint/20"
                    style={{ borderColor: "rgba(129,178,154,0.2)" }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute h-[260px] w-[260px] rounded-full border border-dotted border-peach/20"
                    style={{ borderColor: "rgba(224,122,95,0.15)" }}
                  />

                  {/* Central Hub — The Business */}
                  <div className="relative z-20">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 0 0px rgba(129,178,154,0)",
                          "0 0 0 20px rgba(129,178,154,0.1)",
                          "0 0 0 0px rgba(129,178,154,0)"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-2xl"
                      style={{ border: "1px solid rgba(61,64,91,0.05)" }}
                    >
                      <div 
                        className="flex h-16 w-16 items-center justify-center rounded-2xl"
                        style={{ background: `linear-gradient(135deg, ${palette.ink}, #4F5D75)` }}
                      >
                        <Zap size={32} color="#fff" fill={palette.sand} strokeWidth={1.5} />
                      </div>
                    </motion.div>

                    {/* Floating Info Badges */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="absolute -right-16 -top-4 rounded-xl bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md"
                      style={{ color: palette.mint, border: "1px solid rgba(129,178,154,0.2)" }}
                    >
                      Live Sync
                    </motion.div>
                  </div>

                  {/* Orbiting Benefit Nodes */}
                  {[
                    { icon: Users, color: palette.mint, delay: 0, label: "Happy Staff", radius: 140 },
                    { icon: Clock, color: palette.peach, delay: 1, label: "Zero Wait", radius: 110 },
                    { icon: BarChart3, color: palette.sky, delay: 2, label: "Max ROI", radius: 130 },
                    { icon: CheckCircle2, color: palette.sand, delay: 3, label: "Seamless", radius: 120 },
                  ].map((node, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        rotate: 360,
                      }}
                      transition={{ 
                        duration: 10 + i * 2, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: node.delay 
                      }}
                      className="absolute z-10"
                      style={{ width: node.radius * 2, height: node.radius * 2 }}
                    >
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear", delay: node.delay }}
                        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                      >
                        <div className="group relative">
                          <div 
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xl transition-all group-hover:scale-110"
                            style={{ border: `1px solid ${node.color}33` }}
                          >
                            <node.icon size={20} color={node.color} strokeWidth={2.5} />
                          </div>
                          {/* Mini Label */}
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/80 px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter shadow-sm">
                            {node.label}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}

                  {/* Bottom Success Banner */}
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-8 z-30 flex items-center gap-4 rounded-2xl bg-white/80 px-6 py-3 shadow-2xl backdrop-blur-xl"
                    style={{ border: "1px solid rgba(61,64,91,0.08)" }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                      <CheckCircle2 size={18} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black" style={{ color: palette.ink }}>98.2% Success Rate</p>
                      <p className="text-[10px] opacity-60">Across all business types</p>
                    </div>
                  </motion.div>

                  {/* Glow Blobs */}
                  <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full blur-3xl" style={{ background: "rgba(129,178,154,0.12)" }} />
                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full blur-3xl" style={{ background: "rgba(224,122,95,0.08)" }} />
                </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BusinessFeature = ({ icon: Icon, text, palette }) => (
  <div
    className="flex min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-sm sm:text-base"
    style={{
      borderColor: "rgba(61,64,91,0.12)",
      background: "rgba(255,255,255,0.68)",
      boxShadow: "0 10px 22px rgba(61,64,91,0.05)",
    }}
  >
    <div
      className="flex h-10 w-10 items-center justify-center rounded-lg"
      style={{
        background: "rgba(129,178,154,0.2)",
        color: palette.ink,
      }}
    >
      <Icon size={18} />
    </div>
    <span className="font-semibold leading-snug" style={{ color: palette.ink }}>
      {text}
    </span>
  </div>
);

export default BusinessCTA;
