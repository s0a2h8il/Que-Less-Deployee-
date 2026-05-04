import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Amara S.",
      role: "Clinic Owner",
      initials: "AS",
      color: "bg-blue-600",
      review: "QueueLess transformed our waiting room. Patients now wait in their cars or nearby cafes until they're called. Huge boost for safety!",
      rating: 5,
    },
    {
      name: "Rohan V.",
      role: "Student User",
      initials: "RV",
      color: "bg-teal-500",
      review: "I use it for local snack joints. Being able to join the queue from my dorm and walking over just when I'm next is a lifesaver.",
      rating: 5,
    },
    {
      name: "Jessica P.",
      role: "Salon Manager",
      initials: "JP",
      color: "bg-orange-500",
      review: "Our customers love the transparency. They can see exactly where they are in line, which reduces no-shows and stress for my staff.",
      rating: 4,
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h4 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-blue-600">Testimonials</h4>
          <h2 className="text-4xl font-extrabold text-slate-900">What people say about us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-100 hover:shadow-xl transition-shadow"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#F97316" className="text-orange-500" />
                ))}
              </div>

              {/* Review Text */}
              <p className="flex-1 text-lg text-slate-600 leading-relaxed mb-8 italic">
                "{t.review}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold shadow-lg ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm font-medium text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
