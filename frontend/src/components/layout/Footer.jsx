import React from "react";
import { Link } from "react-router-dom";
import { Zap, Send, Code2, User2, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-slate-900">QueueLess</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Making waiting a thing of the past. Our virtual queue system
              connects businesses and customers seamlessly in real-time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                <Send size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">
                <Code2 size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors">
                <User2 size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li><Link to="/explore" className="hover:text-blue-600">Explore Queues</Link></li>
              <li><Link to="/how-it-works" className="hover:text-blue-600">How It Works</Link></li>
              <li><Link to="/business" className="hover:text-blue-600">For Business</Link></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-blue-600">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
              Get in Touch
            </h4>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <Mail size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Email Us</p>
                <p>support@queueless.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-100 pt-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} QueueLess Inc. Built with love by Sahil.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
