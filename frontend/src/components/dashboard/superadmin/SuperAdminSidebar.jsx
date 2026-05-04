import React from "react";
import {
  BarChart3,
  Users,
  Building2,
  ListOrdered,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/cn";

const SuperAdminSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "businesses", label: "Businesses", icon: Building2 },
    { id: "queues", label: "Queues", icon: ListOrdered },
    { id: "logs", label: "Activity Logs", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col border-r border-slate-800">
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Back to App</span>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Super Admin Panel
        </h2>
        <div className="text-sm text-slate-300">
          <p className="font-semibold">Platform Management</p>
          <p className="text-slate-400 text-xs mt-1">
            Manage users, businesses & content
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
