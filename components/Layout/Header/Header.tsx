// components/layout/Header.tsx
"use client";

import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { Link } from "@/i18n/navigation";

export default function Header() {
  return (
    <header className="bg-white text-black dark:bg-gray-800 shadow dark:text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">GAMO</Link>
        <nav className="space-x-4">
          <Link href={"/"}>Home</Link>
          <Link href={"/catalog"}>Catálogo</Link>
          <Link href={"/dashboard"}>Meu Dashboard</Link>
          <ThemeToggle></ThemeToggle>
        </nav>
      </div>
    </header>
  );
}
