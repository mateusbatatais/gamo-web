"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "./ToastContext";
import { BreadcrumbsProvider } from "./BreadcrumbsContext";
import { PendingActionProvider } from "./PendingActionContext";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <BreadcrumbsProvider>
          <ToastProvider>
            <PendingActionProvider>{children}</PendingActionProvider>
          </ToastProvider>
        </BreadcrumbsProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
