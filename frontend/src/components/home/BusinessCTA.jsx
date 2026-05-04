import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { CheckCircle2, TrendingUp, Monitor } from "lucide-react";

const BusinessCTA = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="relative rounded-[3rem] bg-slate-900 p-8 lg:p-20 shadow-2xl overflow-hidden">
          {/* Background Patterns */}
          <div className="absolute top-0 right-0 h-full w-1/2 bg-blue-600/10 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-500/10 blur-[60px]" />

          <div className="relative flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="mb-6 text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Run your business queue <span className="text-blue-400">smarter.</span>
              </h2>
              <p className="mb-10 text-xl text-slate-400 leading-relaxed">
                Whether you run a clinic, salon, or restaurant, QueueLess helps you 
                manage crowds and improve customer satisfaction instantly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <BusinessFeature icon={Monitor} text="Admin Dashboard" />
                <BusinessFeature icon={CheckCircle2} text="Instant Setup" />
                <BusinessFeature icon={TrendingUp} text="Growth Analytics" />
                <BusinessFeature icon={CheckCircle2} text="Unlimited Queues" />
              </div>

              <Link to="/register">
                <Button size="lg" className="h-16 px-10 text-lg bg-orange-500 hover:bg-orange-600 border-none shadow-xl shadow-orange-500/20">
                  Create Business Queue
                </Button>
              </Link>
            </div>

            {/* Dashboard Mockup Preview */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full max-w-[500px]"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <div className="h-2 w-32 rounded-full bg-white/10 mx-auto" />
                </div>
                <div className="space-y-3">
                  <div className="h-20 rounded-xl bg-blue-500/20 border border-blue-500/30 p-4">
                    <div className="flex justify-between items-center h-full">
                      <div className="space-y-2">
                        <div className="h-2 w-20 rounded bg-white/40" />
                        <div className="h-3 w-12 rounded bg-white" />
                      </div>
                      <div className="h-10 w-24 rounded-lg bg-blue-500 shadow-lg shadow-blue-500/40" />
                    </div>
                  </div>
                  <div className="h-32 rounded-xl bg-white/5 border border-white/10" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BusinessFeature = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-blue-400 border border-white/10">
      <Icon size={20} />
    </div>
    <span className="font-bold text-white/90">{text}</span>
  </div>
);

export default BusinessCTA;
