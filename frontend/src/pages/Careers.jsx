import React from "react";
import { BriefcaseBusiness, Mail, MapPin, Rocket } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

const openings = [
  { title: "Frontend Engineer", type: "Full-time", location: "Remote" },
  { title: "UI / UX Designer", type: "Contract", location: "Remote" },
  { title: "Product Support", type: "Full-time", location: "Ahmedabad" },
];

const Careers = () => {
  return (
    <div className="pb-16">
      <PageHeader
        title="Careers"
        description="Join us if you want to build simple products that reduce real-world waiting stress."
        icon={BriefcaseBusiness}
      />

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        <Card className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E07A5F]">
                Work with us
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
                Build product that people use every day.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
                We care about thoughtful design, fast execution, and honest
                collaboration. Our team works on queue systems, dashboards,
                notifications, and the details that make everyday experiences
                feel smooth.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-black/5 whitespace-nowrap">
                  <Rocket size={16} className="text-[#E07A5F]" />
                  Product-led team
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-black/5 whitespace-nowrap">
                  <MapPin size={16} className="text-[#81B29A]" />
                  Remote-friendly
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-[rgba(61,64,91,0.10)] bg-[rgba(255,255,255,0.75)] p-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Open roles
              </h3>
              <div className="mt-4 space-y-3">
                {openings.map((job) => (
                  <div
                    key={job.title}
                    className="rounded-2xl border border-[rgba(61,64,91,0.08)] bg-[rgba(255,247,234,0.70)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {job.title}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {job.type}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--text-primary)] ring-1 ring-black/5">
                        {job.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                Want to apply?
              </h3>
              <p className="mt-2 text-[var(--text-secondary)]">
                Send your resume and a short note to our team.
              </p>
            </div>
            <Link to="/contact">
              <Button size="lg">Contact Team</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Careers;
