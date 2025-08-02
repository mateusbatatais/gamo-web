"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "./ToastContext";
import { BreadcrumbsProvider } from "./BreadcrumbsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BreadcrumbsProvider>
        <ToastProvider>{children}</ToastProvider>
      </BreadcrumbsProvider>
    </AuthProvider>
  );
}
