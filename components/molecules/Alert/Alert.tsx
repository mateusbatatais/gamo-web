// components/molecules/Alert/Alert.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";

export type AlertType =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary"
  | "secondary"
  | "accent"
  | "neutral";

export type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface AlertProps {
  type?: AlertType;
  message: string;
  durationMs?: number;
  onClose?: () => void;
  needTranslate?: boolean;
  position?: AlertPosition;
  fullWidth?: boolean;
  className?: string;
}

const typeVariants: Record<AlertType, string> = {
  success: "bg-success-100 border-l-4 border-success-500 text-success-800",
  danger: "bg-danger-100 border-l-4 border-danger-500 text-danger-800",
  warning: "bg-warning-100 border-l-4 border-warning-500 text-warning-800",
  info: "bg-info-100 border-l-4 border-info-500 text-info-800",
  primary: "bg-primary-100 border-l-4 border-primary-500 text-primary-800",
  secondary: "bg-secondary-100 border-l-4 border-secondary-500 text-secondary-800",
  accent: "bg-accent-100 border-l-4 border-accent-500 text-accent-800",
  neutral: "bg-neutral-100 border-l-4 border-neutral-500 text-neutral-800",
};

const positionClasses: Record<AlertPosition, string> = {
  "top-left": "fixed top-4 left-4 z-50",
  "top-center": "fixed top-4 left-1/2 -translate-x-1/2 z-50",
  "top-right": "fixed top-4 right-4 z-50",
  "bottom-left": "fixed bottom-4 left-4 z-50",
  "bottom-center": "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
  "bottom-right": "fixed bottom-4 right-4 z-50",
};

const fullWidthPositionClasses: Record<AlertPosition, string> = {
  "top-left": "fixed top-4 left-4 right-4 z-50",
  "top-center": "fixed top-4 left-4 right-4 z-50",
  "top-right": "fixed top-4 left-4 right-4 z-50",
  "bottom-left": "fixed bottom-4 left-4 right-4 z-50",
  "bottom-center": "fixed bottom-4 left-4 right-4 z-50",
  "bottom-right": "fixed bottom-4 left-4 right-4 z-50",
};

export default function Alert({
  type = "info",
  message,
  durationMs = 0,
  onClose,
  needTranslate = false,
  position = "top-right",
  fullWidth = false,
  className = "",
}: AlertProps) {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (durationMs > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [durationMs]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const displayMessage = needTranslate ? t(message) : message;

  const positionClass = fullWidth ? fullWidthPositionClasses[position] : positionClasses[position];

  const containerClasses = fullWidth
    ? `p-4 flex items-start justify-between rounded-md shadow-md ${typeVariants[type]} ${positionClass}`
    : `max-w-md w-full p-4 flex items-start justify-between rounded-md shadow-md ${typeVariants[type]} ${positionClass}`;

  return (
    <div role="alert" className={`${containerClasses} ${className}`} data-testid="alert-container">
      <div className="flex-1 pr-2">
        <p className="break-words">{displayMessage}</p>
      </div>
      <button
        onClick={handleClose}
        className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
        aria-label="Close alert"
        data-testid="alert-close-button"
      >
        <CircleX className="h-5 w-5" />
      </button>
    </div>
  );
}
