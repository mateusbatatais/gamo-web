// contexts/ToastContext.tsx
"use client";

import Toast, { ToastType } from "@/components/molecules/Toast/Toast";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  needTranslate?: boolean;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number,
    needTranslate?: boolean,
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 5000,
    needTranslate: boolean = false,
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, message, type, duration, needTranslate },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-9999 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            durationMs={toast.duration}
            onClose={() => removeToast(toast.id)}
            needTranslate={toast.needTranslate}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
