import React from "react";
import {
  BarChart3,
  Users,
  Building2,
  ListOrdered,
  FileText,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/cn";
import { motion } from "framer-motion";

const SuperAdminSidebar = ({ activeTab, setActiveTab, onNavigate }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "businesses", label: "Businesses", icon: Building2 },
    { id: "queues", label: "Queues", icon: ListOrdered },
    { id: "logs", label: "Activity Logs", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col border-r border-slate-800">
      <div className="mb-8 flex flex-col gap-6">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 group"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shrink-0"
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F2CC8F 100%)",
              boxShadow: "0 8px 16px rgba(224,122,95,0.2)",
            }}
          >
            <Zap size={18} fill="white" className="text-white" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-white">
              Queue<span className="text-[#E07A5F]">-Less</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Virtual Queue
            </span>
          </div>
        </Link>

        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Platform Admin
          </h2>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                onNavigate?.();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-700">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap"
        >
          <ArrowLeft size={16} />
          <span>Regular Dashboard</span>
        </Link>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
