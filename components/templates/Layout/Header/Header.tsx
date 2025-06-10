// components/Layout/Header/Header.tsx
"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import LocaleSwitcher from "@/components/molecules/LocaleSwitcher/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const t = useTranslations("Header");
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          <Image
            src="/images/logo-gamo.svg"
            alt={t("altLogo")}
            className="h-20 w-auto"
            width={100}
            height={30}
            priority={true}
          />
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/catalog"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            {t("catalog")}
          </Link>
          {user ? (
            <Link
              href="/account"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              {t("myAccount")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
            >
              {t("login")}
            </Link>
          )}
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
