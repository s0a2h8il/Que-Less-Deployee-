import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle2, TrendingUp, Monitor } from "lucide-react";

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
                className="mx-auto max-w-[540px] rounded-3xl border p-4 sm:p-5"
                style={{
                  borderColor: "rgba(61,64,91,0.15)",
                  background: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="mb-4 flex items-center gap-2 border-b pb-4"
                  style={{ borderColor: "rgba(61,64,91,0.12)" }}
                >
                  <div className="flex gap-1.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: "#FF7F66" }}
                    />
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: palette.sand }}
                    />
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: palette.mint }}
                    />
                  </div>
                  <div
                    className="mx-auto h-2 w-32 rounded-full"
                    style={{ background: "rgba(61,64,91,0.14)" }}
                  />
                </div>

                <div className="space-y-4">
                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: "rgba(129,178,154,0.45)",
                      background:
                        "linear-gradient(135deg, rgba(129,178,154,0.18) 0%, rgba(190,227,248,0.24) 100%)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div className="space-y-2">
                        <div
                          className="h-2 w-20 rounded"
                          style={{ background: "rgba(61,64,91,0.32)" }}
                        />
                        <div
                          className="h-3 w-14 rounded"
                          style={{ background: palette.ink }}
                        />
                        <div
                          className="h-2 w-24 rounded-full"
                          style={{ background: "rgba(61,64,91,0.18)" }}
                        />
                      </div>
                      <div
                        className="h-10 w-24 rounded-xl"
                        style={{
                          background: palette.peach,
                          boxShadow: "0 8px 20px rgba(224,122,95,0.35)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className="h-16 rounded-xl border"
                      style={{
                        borderColor: "rgba(61,64,91,0.12)",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.80) 0%, rgba(255,247,234,0.92) 100%)",
                      }}
                    />
                    <div
                      className="h-16 rounded-xl border"
                      style={{
                        borderColor: "rgba(61,64,91,0.12)",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.80) 0%, rgba(242,204,143,0.16) 100%)",
                      }}
                    />
                    <div
                      className="h-16 rounded-xl border"
                      style={{
                        borderColor: "rgba(61,64,91,0.12)",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.80) 0%, rgba(190,227,248,0.20) 100%)",
                      }}
                    />
                  </div>

                  <div
                    className="h-28 rounded-2xl border"
                    style={{
                      borderColor: "rgba(61,64,91,0.10)",
                      background:
                        "linear-gradient(135deg, rgba(61,64,91,0.05) 0%, rgba(224,122,95,0.08) 55%, rgba(129,178,154,0.12) 100%)",
                    }}
                  />
                </div>
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
    className="flex items-center gap-3 rounded-xl border px-3 py-2.5 whitespace-nowrap"
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
    <span className="font-semibold" style={{ color: palette.ink }}>
      {text}
    </span>
  </div>
);

export default BusinessCTA;
