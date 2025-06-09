// app/[locale]/dashboard/layout.tsx
import { AuthGuard } from "@/components/templates/Layout/AuthGuard/AuthGuard";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
