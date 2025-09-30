// components/templates/AccountLayout/AccountLayout.tsx
import React, { ReactNode } from "react";
import { AuthGuard } from "@/contexts/AuthGuard";
interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return <AuthGuard>{children}</AuthGuard>;
}
