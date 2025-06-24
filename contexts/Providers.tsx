"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "../contexts/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
