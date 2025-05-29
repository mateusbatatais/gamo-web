// app/[locale]/admin/layout.tsx

import { ReactNode } from "react";
import "../../globals.scss";
import AdminSidebar from "@/components/Layout/AdminSidebar/AdminSidebar";
import AdminHeader from "@/components/Layout/AdminHeader/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar className="w-64" />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <main className="flex-grow p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
