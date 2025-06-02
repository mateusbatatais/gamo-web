// components/Layout/AdminHeader/AdminHeader.tsx
"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

export default function AdminHeader() {
  return (
    <header className="bg-gray-100 shadow dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link
          href="/admin"
          className="text-xl font-semibold text-gray-800 dark:text-gray-100"
        >
          Painel Admin
        </Link>
        <nav className="flex items-center space-x-3">
          <Link
            href="/admin/consoles"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Consoles
          </Link>
          <Link
            href="/admin/games"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Games
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
