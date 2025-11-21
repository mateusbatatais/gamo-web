// src/hooks/useGameDetails.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { Game, GameWithStats, GameStats } from "@/@types/catalog.types";

interface SeriesResponse {
  games: Game[];
  slug?: string;
  name?: string;
}

export default function useGameDetails(slug: string) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  const gameQuery = useQuery({
    queryKey: ["gameDetails", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is required");
      return apiFetch<GameWithStats>(`/games/${slug}`);
    },
    enabled: !!slug && initialized,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });

  const statsQuery = useQuery({
    queryKey: ["gameStats", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is required");
      return apiFetch<GameStats>(`/games/${slug}/stats`);
    },
    enabled: !!slug && initialized && !!gameQuery.data,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const seriesQuery = useQuery({
    queryKey: ["gameSeries", gameQuery.data?.series?.slug],
    queryFn: async () => {
      const seriesSlug = gameQuery.data?.series?.slug;
      if (!seriesSlug) return null;
      return apiFetch<SeriesResponse>(`/games/series/${seriesSlug}`);
    },
    enabled: !!gameQuery.data?.series?.slug,
    staleTime: 24 * 60 * 60 * 1000, // 1 dia para dados de série
  });

  const combinedData = gameQuery.data && {
    ...gameQuery.data,
    stats: statsQuery.data || undefined,
    series: seriesQuery.data || null,
  };

  return {
    data: combinedData,
    isLoading: gameQuery.isLoading || (gameQuery.data && statsQuery.isLoading),
    isError: gameQuery.isError || statsQuery.isError || seriesQuery.isError,
    error: gameQuery.error || statsQuery.error || seriesQuery.error,
    refetch: () => {
      gameQuery.refetch();
      statsQuery.refetch();
      seriesQuery.refetch();
    },
  };
}
