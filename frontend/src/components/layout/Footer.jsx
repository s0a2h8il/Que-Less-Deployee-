import React from "react";
import { Link } from "react-router-dom";
import { Zap, Send, Code2, User2, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="mt-auto border-t py-16"
      style={{
        borderColor: "rgba(61,64,91,0.10)",
        background: "rgba(255,255,255,0.84)",
      }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 whitespace-nowrap"
              aria-label="QueueLess"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
                }}
              >
                <Zap size={18} fill="currentColor" />
              </div>
              <span
                className="text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Queue<span style={{ color: "#E07A5F" }}>-Less</span>
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Making waiting a thing of the past. Our virtual queue system
              connects businesses and customers seamlessly in real-time.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <Send size={20} />
              </a>
              <a
                href="#"
                className="transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <Code2 size={20} />
              </a>
              <a
                href="#"
                className="transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <User2 size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              Quick Links
            </h4>
            <ul
              className="flex flex-col gap-4 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>
                <Link to="/explore" className="hover:underline">
                  Explore Queues
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:underline">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/business" className="hover:underline">
                  For Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul
              className="flex flex-col gap-4 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <li>
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              Get in Touch
            </h4>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "rgba(190,227,248,0.38)" }}
              >
                <Mail size={18} style={{ color: "var(--night-ink)" }} />
              </div>
              <div>
                <p
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Email Us
                </p>
                <p>support@queueless.com</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-16 border-t pt-8 text-center text-sm"
          style={{
            borderColor: "rgba(61,64,91,0.10)",
            color: "var(--text-muted)",
          }}
        >
          <p>
            © {new Date().getFullYear()} QueueLess Inc. Built with love by
            Sahil.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
