import React from "react";
import {
  LayoutDashboard,
  Building2,
  ListOrdered,
  PlusCircle,
  LogOut,
  Zap,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { cn } from "../../../utils/cn";
import { motion } from "framer-motion";

const AdminSidebar = ({ activeTab, setActiveTab, collapsed }) => {
  const { logout, user } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, hidden: isSuperAdmin },
    { id: "businesses", label: "My Businesses", icon: Building2, hidden: isSuperAdmin },
    { id: "queues", label: "My Queues", icon: ListOrdered, hidden: isSuperAdmin },
    { id: "create-queue", label: "Create Queue", icon: PlusCircle, hidden: isSuperAdmin },
    { id: "settings", label: "Profile Settings", icon: User },
  ].filter(item => !item.hidden);

  return (
    <div
      className={cn(
        "bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto transition-all duration-500 ease-[0.16,1,0.3,1]",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className={cn("p-6 flex flex-col gap-6", collapsed && "items-center px-0")}>
        {/* Logo Section */}
        <Link to="/" className={cn("flex items-center group", collapsed ? "gap-0" : "gap-3")}>
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
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-slate-800">
                Queue<span className="text-[#E07A5F]">-Less</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Virtual Queue
              </span>
            </div>
          )}
        </Link>

        {!collapsed && (
          <div className="pt-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Management
            </h2>
          </div>
        )}
      </div>

      <nav className={cn("flex-1 px-4 space-y-2 mt-4", collapsed && "px-0")}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={collapsed ? item.label : ""}
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden",
              activeTab === item.id
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "text-slate-600 hover:bg-slate-50",
              collapsed ? "justify-center px-0 gap-0" : "gap-3",
            )}
          >
            <item.icon size={22} className="shrink-0" />
            {!collapsed && (
              <span
                className={cn(
                  "transition-all duration-300 origin-left opacity-100 w-auto scale-100"
                )}
              >
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-100">
        <button
          onClick={logout}
          title={collapsed ? "Logout" : ""}
          className={cn(
            "w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300 whitespace-nowrap overflow-hidden",
            collapsed ? "justify-center px-0 gap-0" : "gap-3",
          )}
        >
          <LogOut size={22} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
