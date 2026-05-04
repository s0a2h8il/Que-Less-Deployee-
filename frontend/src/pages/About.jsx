import React from "react";
import { Building2, HeartHandshake, Sparkles, Target } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";

const values = [
  {
    icon: Sparkles,
    title: "Simple by design",
    text: "We keep queueing calm, clear, and easy to use for every customer.",
  },
  {
    icon: HeartHandshake,
    title: "Built for trust",
    text: "Businesses and users both need reliability, transparency, and respect.",
  },
  {
    icon: Target,
    title: "Focused on outcomes",
    text: "The goal is shorter perceived wait times and better customer experience.",
  },
];

const About = () => {
  return (
    <div className="pb-16">
      <PageHeader
        title="About QueueLess"
        description="We help businesses manage waiting with less stress and more clarity."
        icon={Building2}
      />

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        <Card className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E07A5F]">
                Our story
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
                Waiting should feel organized, not frustrating.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
                QueueLess was created for clinics, salons, restaurants, and busy
                service counters that want a cleaner, more human queue
                experience. Instead of crowded waiting rooms and uncertainty, we
                give people live status, clear calls, and better flow.
              </p>
            </div>

            <div className="rounded-3xl border border-[rgba(61,64,91,0.10)] bg-[rgba(255,247,234,0.72)] p-6">
              <div className="flex items-center gap-3 text-[var(--text-primary)] whitespace-nowrap">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#E07A5F_0%,#F2CC8F_100%)] text-white shadow-md shadow-[rgba(224,122,95,0.22)]">
                  <Sparkles size={22} />
                </div>
                <div>
                  <p className="font-semibold">Designed for calmer service</p>
                  <p className="text-sm text-[var(--text-secondary)]"
                    One shared system for businesses and customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(190,227,248,0.42)] text-[var(--text-primary)]">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                {text}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
