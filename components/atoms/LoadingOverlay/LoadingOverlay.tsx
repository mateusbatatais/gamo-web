// components/atoms/LoadingOverlay/LoadingOverlay.tsx
import React from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay = ({ isVisible, message = "Carregando..." }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  );
};
