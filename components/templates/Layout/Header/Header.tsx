// components/Layout/Header/Header.tsx
"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import { LocaleSwitcher } from "@/components/molecules/LocaleSwitcher/LocaleSwitcher";

export default function Header() {
  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          <Image
            src="/images/logo-gamo.svg"
            alt="Logo Gamo"
            className="h-20 w-auto"
            width={100}
            height={30}
            priority={true}
          />
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
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
