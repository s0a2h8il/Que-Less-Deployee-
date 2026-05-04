import React from "react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDangerous = false,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${isDangerous ? "bg-red-100" : "bg-amber-100"}`}
            >
              <AlertTriangle
                className={isDangerous ? "text-red-600" : "text-amber-600"}
                size={24}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-slate-500 text-sm mt-1">{message}</p>
          </div>
        </div>

        {/* Warning Box */}
        {isDangerous && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ This action will deactivate the item. It can be reactivated
              later from the system.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            className={
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-amber-600 hover:bg-amber-700"
            }
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
