// components/ui/Toast.tsx
"use client";

import React, { useEffect } from "react";
import { CircleX } from "lucide-react";

type ToastType =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary"
  | "secondary"
  | "accent"
  | "neutral";

interface ToastProps {
  type?: ToastType;
  message: string;
  durationMs?: number; // opcional: desaparece após x ms
  onClose?: () => void;
}

const typeVariants: Record<ToastType, string> = {
  success: "bg-success-100 border-l-4 border-success-500 text-success-800",
  danger: "bg-danger-100 border-l-4 border-danger-500 text-danger-800",
  warning: "bg-warning-100 border-l-4 border-warning-500 text-warning-800",
  info: "bg-info-100 border-l-4 border-info-500 text-info-800",
  primary: "bg-primary-100 border-l-4 border-primary-500 text-primary-800",
  secondary: "bg-secondary-100 border-l-4 border-secondary-500 text-secondary-800",
  accent: "bg-accent-100 border-l-4 border-accent-500 text-accent-800",
  neutral: "bg-neutral-100 border-l-4 border-neutral-500 text-neutral-800",
};

export default function Toast({ type = "info", message, durationMs = 5000, onClose }: ToastProps) {
  // Fechar automaticamente após durationMs (se informado)
  useEffect(() => {
    if (durationMs > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [durationMs, onClose]);

  return (
    <div
      role="alert"
      className={`max-w-md w-full mx-auto p-4 flex items-start justify-between rounded-md shadow-md ${typeVariants[type]}`}
      data-testid="toast-container"
    >
      <div className="flex-1 pr-2">
        <p className="break-words">{message}</p>
      </div>
      <button
        onClick={() => onClose?.()}
        className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Close toast"
        data-testid="toast-close-button"
      >
        <CircleX className="h-5 w-5" />
      </button>
    </div>
  );
}
