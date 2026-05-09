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
    <div
      className="bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto transition-all duration-500 ease-[0.16,1,0.3,1] w-64"
    >
      <div className="p-6 flex flex-col gap-6">
        {/* Logo Section */}
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
            <span className="text-lg font-bold tracking-tight text-slate-800">
              Queue<span className="text-[#E07A5F]">-Less</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Virtual Queue
            </span>
          </div>
        </Link>

        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Platform Admin
          </h2>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
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
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap overflow-hidden",
                isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <Icon size={22} className="shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-100">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all duration-300 whitespace-nowrap overflow-hidden"
        >
          <ArrowLeft size={22} className="shrink-0" />
          <span>Regular Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
