import React, { useState } from "react";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { ListOrdered, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";
import DeleteConfirmModal from "./DeleteConfirmModal";

const QueuesTable = ({
  queues,
  loading,
  filters,
  pagination,
  onFilterChange,
  onPageChange,
  onDelete,
}) => {
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    queueId: null,
    queueTitle: "",
  });

  const handleStatusFilter = (status) => {
    onFilterChange(
      "queues",
      "status",
      status === filters.queues.status ? "" : status,
    );
  };

  const openDeleteModal = (queueId, queueTitle) => {
    setDeleteModal({ show: true, queueId, queueTitle });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.queueId) {
      await onDelete(deleteModal.queueId);
      setDeleteModal({ show: false, queueId: null, queueTitle: "" });
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
            placeholder="Search by queue title..."
            value={filters.queues.search}
            onChange={(e) => onFilterChange("queues", "search", e.target.value)}
            className="w-full bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:bg-white/10 transition-all rounded-xl pl-4 py-3"
          />
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {["active", "paused", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                filters.queues.status === status
                  ? "bg-[#3AA0FF] text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {!queues || queues.length === 0 ? (
        <div className="p-12 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md text-center">
          <ListOrdered size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold" style={{ color: "#F7F4EF" }}>No queues found</h3>
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
                  Queue Title
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Business
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Status
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Waiting
                </th>
                <th 
                  className="px-6 py-5 text-left text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: "#F7F4EF" }}
                >
                  Token
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
              {queues.map((queue, idx) => (
                <motion.tr
                  key={queue._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold" style={{ color: "#FFFFFF" }}>{queue.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium" style={{ color: "rgba(247,244,239,0.9)" }}>
                      {queue.businessId?.name || "Unknown"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                        queue.status === "active"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : queue.status === "paused"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      )}
                    >
                      {queue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">
                      {queue.stats?.waitingCount || 0}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-[#3AA0FF]">
                      #{queue.currentToken || "---"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDeleteModal(queue._id, queue.title)}
                      className="p-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
          <p className="text-xs font-medium text-slate-300 uppercase tracking-widest">
            Page {pagination.queues.currentPage} of{" "}
            {pagination.queues.totalPages}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onPageChange("queues", pagination.queues.currentPage - 1)}
              disabled={pagination.queues.currentPage === 1}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onPageChange("queues", pagination.queues.currentPage + 1)}
              disabled={pagination.queues.currentPage === pagination.queues.totalPages}
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
        title="Close Queue"
        message={`Are you sure you want to close the queue "${deleteModal.queueTitle}"? This will prevent new users from joining.`}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteModal({ show: false, queueId: null, queueTitle: "" })
        }
        isDangerous={true}
      />
    </motion.div>
  );
};

export default QueuesTable;
