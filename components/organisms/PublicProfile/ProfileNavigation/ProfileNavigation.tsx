// components/organisms/PublicProfile/ProfileNavigation/ProfileNavigation.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { ChevronDown } from "lucide-react";

interface ProfileNavigationProps {
  activeSection: string;
}

export const ProfileNavigation = ({ activeSection }: ProfileNavigationProps) => {
  const t = useTranslations("PublicProfile");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: "collection", label: t("collection"), icon: "🎮" },
    { id: "games", label: t("games"), icon: "🕹️" },
    { id: "activity", label: t("activity"), icon: "📊" },
    { id: "reviews", label: t("reviews"), icon: "⭐" },
    { id: "lists", label: t("lists"), icon: "📋" },
    { id: "friends", label: t("friends"), icon: "👥" },
    { id: "likes", label: t("likes"), icon: "❤️" },
  ];

  const createSectionUrl = (section: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", section);
    return `${pathname}?${params.toString()}`;
  };

  // Encontra o label da seção ativa para mobile
  const activeSectionLabel = sections.find((s) => s.id === activeSection)?.label || t("collection");

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between border-b dark:border-gray-700 pb-2">
        <div className="flex space-x-1">
          {sections.slice(0, 4).map((section) => (
            <Link
              key={section.id}
              href={createSectionUrl(section.id)}
              className={clsx(
                "px-4 py-2 rounded-t-lg transition-colors",
                activeSection === section.id
                  ? "bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800",
              )}
            >
              {section.label}
            </Link>
          ))}
        </div>

        <div className="flex space-x-1">
          {sections.slice(4).map((section) => (
            <Link
              key={section.id}
              href={createSectionUrl(section.id)}
              className={clsx(
                "px-4 py-2 rounded-t-lg transition-colors",
                activeSection === section.id
                  ? "bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800",
              )}
            >
              {section.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden relative">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          icon={
            <ChevronDown
              className={clsx("transition-transform", mobileMenuOpen ? "rotate-180" : "")}
            />
          }
          iconPosition="right"
        >
          {activeSectionLabel}
        </Button>

        {mobileMenuOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={createSectionUrl(section.id)}
                className={clsx(
                  "flex items-center px-4 py-3 text-sm",
                  activeSection === section.id
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
