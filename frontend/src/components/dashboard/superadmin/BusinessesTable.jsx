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

  if (!businesses || businesses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">
          No businesses found
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
          placeholder="Search by name or category..."
          value={filters.businesses.search}
          onChange={(e) =>
            onFilterChange("businesses", "search", e.target.value)
          }
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button
            variant={
              filters.businesses.isVerified === "true" ? "primary" : "outline"
            }
            size="sm"
            onClick={() => handleRoleFilter("true")}
          >
            Verified
          </Button>
          <Button
            variant={
              filters.businesses.isVerified === "false" ? "primary" : "outline"
            }
            size="sm"
            onClick={() => handleRoleFilter("false")}
          >
            Unverified
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {businesses.map((business, idx) => (
                <motion.tr
                  key={business._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {business.name}
                    </p>
                    <p className="text-slate-500 text-sm">{business.city}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {business.ownerId?.name || "Unknown"}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {business.ownerId?.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-700 font-medium">
                      {business.category}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {business.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 whitespace-nowrap">
                        <CheckCircle size={14} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 whitespace-nowrap">
                        <XCircle size={14} />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {business.isVerified ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUnverify(business._id)}
                          className="text-amber-600 hover:bg-amber-50 text-xs"
                        >
                          Unverify
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => onVerify(business._id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          Verify
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openDeleteModal(business._id, business.name)
                        }
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <p className="text-sm text-slate-600">
            Page {pagination.businesses.currentPage} of{" "}
            {pagination.businesses.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(
                  "businesses",
                  pagination.businesses.currentPage - 1,
                )
              }
              disabled={pagination.businesses.currentPage === 1}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(
                  "businesses",
                  pagination.businesses.currentPage + 1,
                )
              }
              disabled={
                pagination.businesses.currentPage ===
                pagination.businesses.totalPages
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
