"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useMarketplace } from "@/hooks/useMarketplace";
import MarketplaceMapView from "@/components/organisms/MarketplaceMapView/MarketplaceMapView";

export default function HomeMapSection() {
  const t = useTranslations("HomePage.map");

  // Fetch items for the map (e.g., 50 most recent items)
  const { data: marketplace, isLoading } = useMarketplace({
    page: 1,
    perPage: 50,
    sort: "recent",
  });

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
        <div className="h-[500px] w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </section>
    );
  }

  if (!marketplace?.items || marketplace.items.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("title")}</h2>
      <div className="w-full">
        <MarketplaceMapView
          items={marketplace.items}
          containerStyle={{
            width: "100%",
            height: "500px",
            borderRadius: "0.75rem",
          }}
        />
      </div>
    </section>
  );
}
