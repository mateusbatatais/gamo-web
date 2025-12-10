"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { PublicProfileGameCard } from "../PublicProfileGameCard/PublicProfileGameCard";
import { usePlayingNowGames } from "@/hooks/usePlayingNowGames";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { AlertCircle } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface PlayingNowSectionProps {
  slug: string;
  isOwner?: boolean;
}

const queryClient = new QueryClient();

export const PlayingNowSection = (props: PlayingNowSectionProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayingNowSectionContent {...props} />
    </QueryClientProvider>
  );
};

const PlayingNowSectionContent = ({ slug, isOwner }: PlayingNowSectionProps) => {
  const t = useTranslations("PublicProfile");
  const { data, isLoading, error } = usePlayingNowGames(slug);

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || data.items.length === 0) {
    return null;
  }

  // Take first 5 items
  const displayItems = data.items.slice(0, 5);
  const totalPlaying = data.meta.total;

  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          {t("playingNow")}
        </h2>
        {totalPlaying > 5 && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800">
            <AlertCircle size={16} />
            <span>{t("playingNowManyGames", { count: totalPlaying })}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
        {displayItems.map((game) => (
          <PublicProfileGameCard
            key={game.id}
            game={game}
            isOwner={isOwner}
            type="collection"
            compact
          />
        ))}
      </div>
    </div>
  );
};
