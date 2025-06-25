"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "./ToastContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
