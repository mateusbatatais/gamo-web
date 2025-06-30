// components/templates/Layout/Header/Header.tsx
"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import LocaleSwitcher from "@/components/molecules/LocaleSwitcher/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { Menu, X } from "lucide-react";

export default function Header() {
  const t = useTranslations("Header");
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Primeira linha: Logo e controles mobile */}
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-shrink-0"
          >
            <Image
              src="/images/logo-gamo.svg"
              alt={t("altLogo")}
              className="h-16 w-auto"
              width={80}
              height={24}
              priority={true}
            />
          </Link>

          {/* Barra de busca - desktop */}
          <div className="hidden md:block w-full max-w-md mx-4">
            <SearchBar variant="header" />
          </div>

          <div className="flex items-center space-x-2">
            <div className="md:hidden">
              <SearchBar variant="header" />
            </div>

            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 md:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-4">
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
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/catalog"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("catalog")}
              </Link>
              {user ? (
                <Link
                  href="/account"
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("myAccount")}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("login")}
                </Link>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-300">{t("language")}</span>
                <LocaleSwitcher />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-300">{t("theme")}</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
