// hooks/useGameData.ts
"use client";

import { useUserGamesPublic } from "@/hooks/usePublicProfile";
import { UserGame } from "@/@types/collection.types";
import { PaginationMeta } from "@/@types/catalog.types";

interface UseGameDataProps {
  slug: string;
  locale: string;
  status: string;
  page: number;
  perPage: number;
  sort: string;
  searchQuery: string;
  gameFilters: {
    selectedGenres: number[];
    selectedPlatforms: number[];
    selectedMedia?: string[];
    showOnlyFavorites?: boolean;
  };
}

interface UseGameDataReturn {
  games: UserGame[];
  gamesMeta: PaginationMeta | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useGameData({
  slug,
  locale,
  status,
  page,
  perPage,
  sort,
  searchQuery,
  gameFilters,
}: UseGameDataProps): UseGameDataReturn {
  const {
    data: gamesData,
    isLoading,
    error,
  } = useUserGamesPublic(
    slug,
    locale,
    status,
    page,
    perPage,
    sort,
    searchQuery,
    gameFilters.selectedGenres,
    gameFilters.selectedPlatforms,
    gameFilters.showOnlyFavorites,
    undefined, // standalone
    gameFilters.selectedMedia,
  );

  return {
    games: gamesData?.items || [],
    gamesMeta: gamesData?.meta,
    isLoading,
    error: error || null,
  };
}
