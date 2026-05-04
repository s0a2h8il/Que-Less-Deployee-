import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Bell, Repeat, LayoutGrid, Smartphone } from "lucide-react";

const QueueBenefits = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Save Waiting Time",
      description: "Reduce physical wait times by up to 40% with virtual check-ins.",
    },
    {
      icon: LayoutGrid,
      title: "Real-time Tracking",
      description: "Monitor your position and estimated wait time live on your dashboard.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated alerts via WebSockets when you are next in line.",
    },
    {
      icon: Repeat,
      title: "Spot Exchange",
      description: "Request to swap positions with others if you're running late.",
    },
    {
      icon: ShieldCheck,
      title: "Crowd Control",
      description: "Better safety for businesses by preventing crowded waiting rooms.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Optimized experience across all devices, no app download required.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-600">Why QueueLess</h4>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              A smarter way to wait<br /> for the modern world.
            </h2>
          </div>
          <p className="text-xl text-slate-500 max-w-lg mb-2">
            We've built features that solve real-world waiting problems for both businesses and their customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-5 p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                <benefit.icon size={24} />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{benefit.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QueueBenefits;
