import React from "react";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import QueueBenefits from "../components/home/QueueBenefits";
import BusinessCTA from "../components/home/BusinessCTA";
import Testimonials from "../components/home/Testimonials";

const Home = () => {
  return (
    <div className="bg-white">
      {/* 1. Hero Section (with GSAP & Animated Queue Preview) */}
      <HeroSection />

      {/* 2. How It Works Section */}
      <HowItWorks />

      {/* 3. Queue Benefits Section */}
      <QueueBenefits />

      {/* 4. Business CTA Section (The "Run Smarter" banner) */}
      <BusinessCTA />

      {/* 5. Testimonials Section */}
      <Testimonials />

      {/* Final Bottom CTA */}
      <section className="py-24 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-8">Ready to skip the line?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="h-14 px-10 rounded-2xl bg-white text-blue-600 font-black hover:bg-slate-50 transition-all">
              Join for Free
            </button>
            <button className="h-14 px-10 rounded-2xl bg-blue-700 text-white font-black hover:bg-blue-800 transition-all border border-blue-500">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
