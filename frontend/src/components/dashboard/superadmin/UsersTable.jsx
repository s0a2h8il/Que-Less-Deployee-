import React from "react";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

const UsersTable = ({
  users,
  loading,
  filters,
  pagination,
  onFilterChange,
  onPageChange,
}) => {
  const handleRoleFilter = (role) => {
    onFilterChange("users", "role", role === filters.users.role ? "" : role);
  };

  if (loading) {
    return (
      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Input
            placeholder="Search by name or email..."
            value={filters.users.search}
            onChange={(e) => onFilterChange("users", "search", e.target.value)}
            className="w-full bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:bg-white/10 transition-all rounded-xl pl-4 py-3"
          />
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {["user", "admin", "superadmin"].map((role) => (
            <button
              key={role}
              onClick={() => handleRoleFilter(role)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                filters.users.role === role
                  ? "bg-[#3AA0FF] text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {!users || users.length === 0 ? (
        <div className="p-12 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md text-center">
          <Users size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold" style={{ color: "#F7F4EF" }}>No users found</h3>
          <p style={{ color: "rgba(247,244,239,0.7)", marginTop: "0.5rem" }}>
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/20">
              <tr>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Name
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Email
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Role
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold" style={{ color: "#FFFFFF" }}>{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm" style={{ color: "rgba(247,244,239,0.9)" }}>{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                        user.role === "superadmin"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : user.role === "admin"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      )}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm" style={{ color: "rgba(247,244,239,0.7)" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "rgba(247,244,239,0.6)" }}>
            Page {pagination.users.currentPage} of {pagination.users.totalPages}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onPageChange("users", pagination.users.currentPage - 1)}
              disabled={pagination.users.currentPage === 1}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onPageChange("users", pagination.users.currentPage + 1)}
              disabled={pagination.users.currentPage === pagination.users.totalPages}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        </div>
      )}
    </motion.div>
  );
};

export default UsersTable;
