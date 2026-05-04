import React from "react";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Users size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">No users found</h3>
        <p className="text-slate-500 mt-2">
          Try adjusting your search or filters
        </p>
      </Card>
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
        <Input
          placeholder="Search by name or email..."
          value={filters.users.search}
          onChange={(e) => onFilterChange("users", "search", e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          {["user", "admin", "superadmin"].map((role) => (
            <Button
              key={role}
              variant={filters.users.role === role ? "primary" : "outline"}
              size="sm"
              onClick={() => handleRoleFilter(role)}
              className="capitalize"
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 text-sm">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === "superadmin"
                          ? "bg-red-100 text-red-700"
                          : user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <p className="text-sm text-slate-600">
            Page {pagination.users.currentPage} of {pagination.users.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange("users", pagination.users.currentPage - 1)
              }
              disabled={pagination.users.currentPage === 1}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange("users", pagination.users.currentPage + 1)
              }
              disabled={
                pagination.users.currentPage === pagination.users.totalPages
              }
              className="gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default UsersTable;
