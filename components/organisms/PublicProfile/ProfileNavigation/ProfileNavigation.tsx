// components/organisms/PublicProfile/ProfileNavigation/ProfileNavigation.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { ChevronDown } from "lucide-react";

interface ProfileNavigationProps {
  slug: string;
}

export const ProfileNavigation = ({ slug }: ProfileNavigationProps) => {
  const t = useTranslations("PublicProfile");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: "", label: t("collection"), icon: "🎮" },
    { id: "games", label: t("games"), icon: "🕹️" },
    { id: "activity", label: t("activity"), icon: "📊" },
    { id: "reviews", label: t("reviews"), icon: "⭐" },
    { id: "lists", label: t("lists"), icon: "📋" },
    { id: "friends", label: t("friends"), icon: "👥" },
    { id: "likes", label: t("likes"), icon: "❤️" },
  ];

  const pathParts = pathname.split("/");
  const last = pathParts[pathParts.length - 1];

  const activeSection = last === slug ? "" : last;

  const createSectionUrl = (sectionId: string) => {
    return sectionId ? `/user/${slug}/${sectionId}` : `/user/${slug}`;
  };

  const activeSectionLabel = sections.find((s) => s.id === activeSection)?.label || t("collection");

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between border-b border-gray-300 dark:border-gray-700">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {sections.map((section) => {
            const href = createSectionUrl(section.id);
            const isActive = activeSection === section.id;
            return (
              <Link
                key={section.id}
                href={href}
                className={clsx(
                  "px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800",
                )}
              >
                {section.label}
              </Link>
            );
          })}
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
              size={16}
            />
          }
          iconPosition="right"
        >
          {activeSectionLabel}
        </Button>

        {mobileMenuOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            {sections.map((section) => {
              const href = createSectionUrl(section.id);
              const isActive = activeSection === section.id;

              return (
                <Link
                  key={section.id}
                  href={href}
                  className={clsx(
                    "flex items-center px-4 py-3 text-sm",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
