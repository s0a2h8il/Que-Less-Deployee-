import React from "react";
import {
  LayoutDashboard,
  Building2,
  ListOrdered,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { cn } from "../../../utils/cn";

const AdminSidebar = ({ activeTab, setActiveTab, collapsed }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "businesses", label: "My Businesses", icon: Building2 },
    { id: "queues", label: "My Queues", icon: ListOrdered },
    { id: "create-queue", label: "Create Queue", icon: PlusCircle },
  ];

  return (
    <div 
      className={cn(
        "bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)] overflow-hidden transition-all duration-300 ease-[0.22,1,0.36,1]",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("p-6 transition-all duration-300", collapsed ? "opacity-0 h-0 p-0" : "opacity-100")}>
        {!collapsed && (
          <>
            <h2 className="text-xl font-bold text-slate-800 whitespace-nowrap">Admin Panel</h2>
            <p className="text-sm text-slate-500 mt-1 whitespace-nowrap">Manage your business</p>
          </>
        )}
      </div>

      <nav className={cn("flex-1 px-4 space-y-2 mt-4", collapsed && "px-2")}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={collapsed ? item.label : ""}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden",
              activeTab === item.id
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "text-slate-600 hover:bg-slate-50",
              collapsed && "justify-center px-0"
            )}
          >
            <item.icon size={22} className="shrink-0" />
            <span className={cn(
              "transition-all duration-300 origin-left",
              collapsed ? "opacity-0 w-0 scale-0" : "opacity-100 w-auto scale-100"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-100">
        <button
          onClick={logout}
          title={collapsed ? "Logout" : ""}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300 whitespace-nowrap overflow-hidden",
            collapsed && "justify-center px-0"
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
