// app/[locale]/dashboard/layout.tsx
import { AuthGuard } from "@/contexts/AuthGuard";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
