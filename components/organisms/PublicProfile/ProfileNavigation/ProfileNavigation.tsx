// components/organisms/PublicProfile/ProfileNavigation/ProfileNavigation.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { ChevronDown } from "lucide-react";
import { Tabs, TabItem } from "@/components/atoms/Tabs/Tabs";

interface ProfileNavigationProps {
  slug: string;
}

export const ProfileNavigation = ({ slug }: ProfileNavigationProps) => {
  const t = useTranslations("PublicProfile");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: "", label: t("collection"), icon: "🎮" },
    { id: "games", label: t("games"), icon: "🕹️" },
    { id: "market", label: t("market"), icon: "🛒" },
    { id: "reviews", label: t("reviews"), icon: "⭐" },
    { id: "favorites", label: t("favorites"), icon: "❤️" },
  ];

  const pathParts = pathname.split("/");
  const last = pathParts[pathParts.length - 1];
  const activeSection = last === slug ? "" : last;

  const createSectionUrl = (sectionId: string) => {
    return sectionId ? `/user/${slug}/${sectionId}` : `/user/${slug}`;
  };

  const activeSectionLabel = sections.find((s) => s.id === activeSection)?.label || t("collection");

  // Encontra o índice da seção ativa
  const activeTabIndex = sections.findIndex((s) => s.id === activeSection);

  // Manipulador para mudança de aba - navega para a URL correspondente
  const handleTabChange = (newValue: number) => {
    const sectionId = sections[newValue].id;
    router.push(createSectionUrl(sectionId));
  };

  return (
    <>
      {/* Desktop Navigation usando Tabs com navegação personalizada */}
      <div className="hidden md:block mt-4">
        <Tabs
          defaultValue={activeTabIndex}
          onChange={handleTabChange}
          fullWidth
          tabListClassName="overflow-x-auto scrollbar-hide"
          tabClassName="px-4 py-2 rounded-none"
          activeTabClassName="text-primary-600 dark:text-primary-400 font-semibold border-b-2 border-primary-500"
          inactiveTabClassName="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
        >
          {sections.map((section) => (
            <TabItem key={section.id} label={section.label} className="cursor-pointer">
              {/* Conteúdo vazio pois a navegação é tratada pelo onChange */}
              <div className="hidden" />
            </TabItem>
          ))}
        </Tabs>
      </div>

      {/* Mobile Navigation (mantido igual) */}
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
                      ? "bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400",
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
