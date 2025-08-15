// src/hooks/useGames.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { GameListResponse } from "@/@types/game";

interface UseGamesOptions {
  page: number;
  perPage: number;
  sort?: string;
  selectedGenres?: number[];
  selectedPlatforms?: number[];
  searchQuery?: string;
}

export function useGames({
  page,
  perPage,
  sort = "score-desc",
  selectedGenres = [],
  selectedPlatforms = [],
  searchQuery = "",
}: UseGamesOptions) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<GameListResponse, Error>({
    queryKey: [
      "games",
      page,
      perPage,
      sort,
      selectedGenres.join(","),
      selectedPlatforms.join(","),
      searchQuery,
    ],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");

      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        sort,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (selectedGenres.length > 0) params.append("genres", selectedGenres.join(","));
      if (selectedPlatforms.length > 0) params.append("platforms", selectedPlatforms.join(","));

      return await apiFetch(`/games?${params.toString()}`);
    },
    enabled: initialized,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: (previousData) => previousData,
  });
}
