// app/[locale]/admin/layout.tsx

import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col flex-grow">
        <main className="flex-grow p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
