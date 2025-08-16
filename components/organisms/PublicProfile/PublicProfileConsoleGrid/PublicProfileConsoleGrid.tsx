// components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileConsoleCard } from "../PublicProfileConsoleCard/PublicProfileConsoleCard";
import { useUserConsolesPublic } from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

interface PublicProfileConsoleGridProps {
  slug: string;
  locale: string;
  isOwner?: boolean;
}

const queryClient = new QueryClient();

export const PublicProfileConsoleGrid = ({
  slug,
  locale,
  isOwner = false,
}: PublicProfileConsoleGridProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicProfileConsoleGridContent slug={slug} locale={locale} isOwner={isOwner} />
    </QueryClientProvider>
  );
};

const PublicProfileConsoleGridContent = ({
  slug,
  locale,
  isOwner,
}: PublicProfileConsoleGridProps) => {
  const t = useTranslations("PublicProfile");
  const { data: consoles, isLoading, error } = useUserConsolesPublic(slug, locale);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t("errorLoading")}</p>
        </div>
      </Card>
    );
  }

  if (!consoles || consoles.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t("noConsoles")}</p>
        </div>
      </Card>
    );
  }

  const groupedConsoles = consoles.reduce(
    (acc, consoleItem) => {
      if (!acc[consoleItem.status]) {
        acc[consoleItem.status] = [];
      }
      acc[consoleItem.status].push(consoleItem);
      return acc;
    },
    {} as Record<string, typeof consoles>,
  );

  const ownedConsoles = groupedConsoles["OWNED"] || [];
  const sellingConsoles = groupedConsoles["SELLING"] || [];
  const lookingForConsoles = groupedConsoles["LOOKING_FOR"] || [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("collection")}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {ownedConsoles.map((consoleItem) => (
          <PublicProfileConsoleCard
            key={`owned-${consoleItem.id}`}
            consoleItem={consoleItem}
            isOwner={isOwner || false}
          />
        ))}
      </div>
      {sellingConsoles.length > 0 && (
        <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.selling")}</h2>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {sellingConsoles.map((consoleItem) => (
          <PublicProfileConsoleCard
            key={`selling-${consoleItem.id}`}
            consoleItem={consoleItem}
            isOwner={isOwner || false}
          />
        ))}
      </div>
      {lookingForConsoles.length > 0 && (
        <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.lookingFor")}</h2>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {lookingForConsoles.map((consoleItem) => (
          <PublicProfileConsoleCard
            key={`lookingfor-${consoleItem.id}`}
            consoleItem={consoleItem}
            isOwner={isOwner || false}
          />
        ))}
      </div>
    </div>
  );
};
