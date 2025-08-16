// components/organisms/PublicProfile/PublicProfileGameGrid/PublicProfileGameGrid.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/atoms/Card/Card";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { useUserGamesPublic } from "@/hooks/usePublicProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";

interface PublicProfileGameGridProps {
  slug: string;
  locale: string;
  isOwner?: boolean;
}

const queryClient = new QueryClient();

export const PublicProfileGameGrid = ({
  slug,
  locale,
  isOwner = false,
}: PublicProfileGameGridProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicProfileGameGridContent slug={slug} locale={locale} isOwner={isOwner} />
    </QueryClientProvider>
  );
};

const PublicProfileGameGridContent = ({ slug, locale, isOwner }: PublicProfileGameGridProps) => {
  const t = useTranslations("PublicProfile");
  const { data: games, isLoading, error } = useUserGamesPublic(slug, locale);

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

  if (!games || games.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t("noGames")}</p>
        </div>
      </Card>
    );
  }

  const groupedGames = games.reduce(
    (acc, game) => {
      if (!acc[game.status]) {
        acc[game.status] = [];
      }
      acc[game.status].push(game);
      return acc;
    },
    {} as Record<string, typeof games>,
  );

  const ownedGames = groupedGames["OWNED"] || [];
  const sellingGames = groupedGames["SELLING"] || [];
  const lookingForGames = groupedGames["LOOKING_FOR"] || [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">{t("gamesCollection")}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
        {ownedGames.map((game) => (
          <PublicProfileGameCard
            key={`owned-${game.id}`}
            game={game}
            isOwner={isOwner || false}
            slug={slug}
          />
        ))}
      </div>

      {sellingGames.length > 0 && (
        <>
          <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.selling")}</h2>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {sellingGames.map((game) => (
              <PublicProfileGameCard
                key={`selling-${game.id}`}
                game={game}
                isOwner={isOwner || false}
                slug={slug}
              />
            ))}
          </div>
        </>
      )}

      {lookingForGames.length > 0 && (
        <>
          <h2 className="text-xl font-semibold my-6 dark:text-white">{t("status.lookingFor")}</h2>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {lookingForGames.map((game) => (
              <PublicProfileGameCard
                key={`lookingfor-${game.id}`}
                game={game}
                isOwner={isOwner || false}
                slug={slug}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
