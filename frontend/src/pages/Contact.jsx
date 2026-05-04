import React, { useState } from "react";
import { Mail, MapPin, PhoneCall, SendHorizonal } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="pb-16">
      <PageHeader
        title="Contact"
        description="Reach out for support, partnership requests, or career questions."
        icon={Mail}
      />

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
            Get in touch
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--text-secondary)] leading-8">
            We usually respond within one business day. For product support,
            please include your account email and a short description of the
            issue.
          </p>

          <div className="mt-8 space-y-4">
            <ContactItem
              icon={Mail}
              title="Email"
              text="support@queueless.com"
            />
            <ContactItem
              icon={PhoneCall}
              title="Phone"
              text="+91 98765 43210"
            />
            <ContactItem
              icon={MapPin}
              title="Location"
              text="Ahmedabad, India"
            />
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">
            Send a message
          </h3>
          <form className="mt-6 space-y-4">
            <Input
              label="Your name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                How can we help?
              </label>
              <textarea
                name="message"
                rows={6}
                placeholder="How can we help?"
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all resize-none"
                style={{
                  background: "rgba(255,255,255,0.84)",
                  borderColor: "rgba(61,64,91,0.12)",
                  color: "var(--text-primary)",
                  boxShadow: "0 8px 20px rgba(61,64,91,0.04)",
                }}
              />
            </div>
          </form>
          <div className="mt-6">
            <Button leftIcon={<SendHorizonal size={16} />}>Send Message</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ContactItem = ({ icon: Icon, title, text }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-[rgba(61,64,91,0.10)] bg-[rgba(255,247,234,0.68)] p-4">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(190,227,248,0.45)] text-[var(--text-primary)]">
      <Icon size={18} />
    </div>
    <div>
      <p className="font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="text-sm text-[var(--text-secondary)]">{text}</p>
    </div>
  </div>
);

export default Contact;
