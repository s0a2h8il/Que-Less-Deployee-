import React from "react";
import { 
  LayoutDashboard, 
  Building2, 
  ListOrdered, 
  PlusCircle, 
  LogOut 
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { cn } from "../../../utils/cn";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "businesses", label: "My Businesses", icon: Building2 },
    { id: "queues", label: "My Queues", icon: ListOrdered },
    { id: "create-queue", label: "Create Queue", icon: PlusCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your business</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              activeTab === item.id
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
