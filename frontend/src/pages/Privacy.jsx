import React from "react";
import { ShieldCheck, LockKeyhole, FileText } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";

const sections = [
  {
    title: "Information we collect",
    text: "We only collect information needed to create accounts, manage queues, and support users and businesses.",
  },
  {
    title: "How we use data",
    text: "Your data helps us authenticate users, send queue updates, and improve the service experience.",
  },
  {
    title: "Your choices",
    text: "You can update your profile, log out anytime, and contact us if you want help with your data.",
  },
];

const Privacy = () => {
  return (
    <div className="pb-16">
      <PageHeader
        title="Privacy Policy"
        description="A simple summary of how QueueLess handles information."
        icon={ShieldCheck}
      />

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-4 rounded-3xl border border-[rgba(61,64,91,0.10)] bg-[rgba(255,247,234,0.72)] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(129,178,154,0.24)] text-[var(--text-primary)]">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Privacy-first basics
              </h2>
              <p className="mt-1 text-[var(--text-secondary)]">
                We keep the policy clear, short, and easy to understand.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.title} className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(190,227,248,0.42)] text-[var(--text-primary)]">
                <FileText size={18} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
                {section.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                {section.text}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
