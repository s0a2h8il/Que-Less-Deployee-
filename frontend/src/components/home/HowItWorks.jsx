import React from "react";
import { motion } from "framer-motion";
import { Search, LogIn, Bell } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Find a Queue",
      description: "Search for a clinic, salon, or store near you and view their live queue status.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: LogIn,
      title: "2. Join Virtually",
      description: "Get your digital token instantly. No more standing in physical lines.",
      color: "bg-teal-50 text-teal-600",
    },
    {
      icon: Bell,
      title: "3. Get Notified",
      description: "Receive live alerts when your turn is near. Arrive exactly when called.",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-slate-900">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">
            Join a queue in seconds and wait where you're comfortable. 
            QueueLess makes waiting simple, smart, and safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-soft hover:shadow-xl transition-all"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-black shadow-lg">
                {index + 1}
              </div>

              <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-2xl ${step.color} group-hover:scale-110 transition-transform`}>
                <step.icon size={36} />
              </div>

              <h3 className="mb-4 text-2xl font-bold text-slate-900">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
