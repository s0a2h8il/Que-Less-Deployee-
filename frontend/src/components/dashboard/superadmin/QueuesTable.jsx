import React, { useState } from "react";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { ListOrdered, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
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
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (!queues || queues.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ListOrdered size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">
          No queues found
        </h3>
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
          placeholder="Search by queue title..."
          value={filters.queues.search}
          onChange={(e) => onFilterChange("queues", "search", e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          {["active", "paused", "closed"].map((status) => (
            <Button
              key={status}
              variant={filters.queues.status === status ? "primary" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter(status)}
              className="capitalize"
            >
              {status}
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
                  Queue Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Waiting Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Current Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queues.map((queue, idx) => (
                <motion.tr
                  key={queue._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {queue.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-700">
                      {queue.businessId?.name || "Unknown"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        queue.status === "active"
                          ? "bg-green-100 text-green-700"
                          : queue.status === "paused"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {queue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {queue.stats?.waitingCount || 0}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-indigo-600">
                      #{queue.currentToken || "---"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDeleteModal(queue._id, queue.title)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <p className="text-sm text-slate-600">
            Page {pagination.queues.currentPage} of{" "}
            {pagination.queues.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange("queues", pagination.queues.currentPage - 1)
              }
              disabled={pagination.queues.currentPage === 1}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange("queues", pagination.queues.currentPage + 1)
              }
              disabled={
                pagination.queues.currentPage === pagination.queues.totalPages
              }
              className="gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>

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
