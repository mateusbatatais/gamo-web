// components/Layout/AdminSidebar/AdminSidebar.tsx
"use client";

import React from "react";
import { Link } from "@/i18n/navigation";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r dark:bg-gray-800 dark:border-gray-700">
      <ul className="space-y-2 p-4">
        <li>
          <Link
            href="/admin"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/users"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Usuários
          </Link>
        </li>
        <li>
          <Link
            href="/admin/settings"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Configurações
          </Link>
        </li>
      </ul>
    </aside>
  );
}
