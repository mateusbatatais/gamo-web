// components/Layout/Header/Header.tsx
"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

export default function Header() {
  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 dark:text-gray-100"
        >
          GAMO
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/catalogo"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Catálogo
          </Link>
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Entrar
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
