// components/organisms/PublicProfile/ProfileNavigation/ProfileNavigation.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface ProfileNavigationProps {
  slug: string;
}

export const ProfileNavigation = ({ slug }: ProfileNavigationProps) => {
  const t = useTranslations("PublicProfile");
  const pathname = usePathname();

  const sections = [
    { id: "", label: t("collection"), icon: "🎮" },
    { id: "games", label: t("games"), icon: "🕹️" },
    { id: "activity", label: t("activity"), icon: "📊" },
    { id: "reviews", label: t("reviews"), icon: "⭐" },
    { id: "lists", label: t("lists"), icon: "📋" },
    { id: "friends", label: t("friends"), icon: "👥" },
    { id: "likes", label: t("likes"), icon: "❤️" },
  ];

  // Determina a seção ativa com base na URL
  const activeSection = pathname.split("/").pop() || "";

  return (
    <div className="flex justify-between border-b dark:border-gray-700 pb-2">
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
        {sections.map((section) => {
          const href = section.id ? `/user/${slug}/${section.id}` : `/user/${slug}`;

          return (
            <Link
              key={section.id}
              href={href}
              className={clsx(
                "px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap",
                activeSection === section.id
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
  );
};
