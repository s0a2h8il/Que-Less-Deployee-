import React, { useState } from "react";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";
import DeleteConfirmModal from "./DeleteConfirmModal";

const BusinessesTable = ({
  businesses,
  loading,
  filters,
  pagination,
  onFilterChange,
  onPageChange,
  onVerify,
  onUnverify,
  onDelete,
}) => {
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    businessId: null,
    businessName: "",
  });

  const handleRoleFilter = (status) => {
    onFilterChange(
      "businesses",
      "isVerified",
      status === filters.businesses.isVerified ? "" : status,
    );
  };

  const openDeleteModal = (businessId, businessName) => {
    setDeleteModal({ show: true, businessId, businessName });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.businessId) {
      await onDelete(deleteModal.businessId);
      setDeleteModal({ show: false, businessId: null, businessName: "" });
    }
  };

  if (loading) {
    return (
      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-white/5 animate-pulse"
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
            placeholder="Search by name or category..."
            value={filters.businesses.search}
            onChange={(e) => onFilterChange("businesses", "search", e.target.value)}
            className="w-full bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:bg-white/10 transition-all rounded-xl pl-4 py-3"
          />
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => handleRoleFilter("true")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
              filters.businesses.isVerified === "true"
                ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            Verified
          </button>
          <button
            onClick={() => handleRoleFilter("false")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
              filters.businesses.isVerified === "false"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            Unverified
          </button>
        </div>
      </div>

      {!businesses || businesses.length === 0 ? (
        <div className="p-12 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md text-center">
          <Building2 size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold" style={{ color: "#F7F4EF" }}>No businesses found</h3>
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
                  Business Name
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Owner
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Category
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Verified
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {businesses.map((business, idx) => (
                <motion.tr
                  key={business._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold" style={{ color: "#FFFFFF" }}>{business.name}</p>
                    <p className="text-xs" style={{ color: "rgba(247,244,239,0.6)" }}>{business.city}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium" style={{ color: "#FFFFFF" }}>
                      {business.ownerId?.name || "Unknown"}
                    </p>
                    <p className="text-xs truncate max-w-[150px]" style={{ color: "rgba(247,244,239,0.7)" }}>
                      {business.ownerId?.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm" style={{ color: "rgba(247,244,239,0.9)" }}>
                      {business.category}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {business.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-500/10 text-green-400 border border-green-500/20">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <XCircle size={12} />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {business.isVerified ? (
                        <button
                          onClick={() => onUnverify(business._id)}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 transition-all"
                        >
                          Unverify
                        </button>
                      ) : (
                        <button
                          onClick={() => onVerify(business._id)}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(business._id, business.name)}
                        className="p-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
          <p className="text-xs font-medium text-slate-300 uppercase tracking-widest">
            Page {pagination.businesses.currentPage} of{" "}
            {pagination.businesses.totalPages}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onPageChange("businesses", pagination.businesses.currentPage - 1)}
              disabled={pagination.businesses.currentPage === 1}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onPageChange("businesses", pagination.businesses.currentPage + 1)}
              disabled={pagination.businesses.currentPage === pagination.businesses.totalPages}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.show}
        title="Delete Business"
        message={`Are you sure you want to deactivate "${deleteModal.businessName}"? This can be undone later.`}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteModal({ show: false, businessId: null, businessName: "" })
        }
        isDangerous={true}
      />
    </motion.div>
  );
};

export default BusinessesTable;
