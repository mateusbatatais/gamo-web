// components/molecules/ConfirmationModal/ConfirmationModal.tsx
import React from "react";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Button } from "@/components/atoms/Button/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} title={title}>
      <div className="p-4">
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="transparent" onClick={onClose}>
            {cancelText}
          </Button>
          <Button status="danger" onClick={onConfirm} loading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
