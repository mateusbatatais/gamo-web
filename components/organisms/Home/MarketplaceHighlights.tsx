"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useMarketplace } from "@/hooks/useMarketplace";
import MarketplaceCard from "@/components/molecules/MarketplaceCard/MarketplaceCard";
import { ArrowRight } from "lucide-react";
import { MarketplaceItem } from "@/@types/catalog.types";

export default function MarketplaceHighlights() {
  const t = useTranslations("HomePage.marketplace");
  const { data: marketplace, isLoading } = useMarketplace({
    page: 1,
    perPage: 4,
    sort: "recent",
  });

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!marketplace?.items || marketplace.items.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        <Link
          href="/marketplace"
          className="group inline-flex items-center justify-center font-medium rounded transition-colors cursor-pointer gap-2 leading-none px-4 py-3 text-base bg-transparent border-transparent text-primary-500 hover:bg-primary-500/10"
        >
          {t("viewAll")}
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {marketplace.items.map((item: MarketplaceItem) => (
          <MarketplaceCard key={`${item.itemType}-${item.id}`} item={item} viewMode="grid" />
        ))}
      </div>
    </section>
  );
}
