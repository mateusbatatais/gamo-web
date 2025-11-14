// hooks/useMarketData.ts
"use client";

import {
  useUserGamesPublic,
  useUserConsolesPublic,
  useUserAccessoriesPublic,
} from "@/hooks/usePublicProfile";
import { UserGame, UserConsole, UserAccessory } from "@/@types/collection.types";
import { PaginationMeta } from "@/@types/catalog.types";

interface UseMarketDataProps {
  slug: string;
  locale: string;
  status: "SELLING" | "LOOKING_FOR";
  page: number;
  perPage: number;
  sort: string;
  searchQuery: string;
  gameFilters: {
    selectedGenres: number[];
    selectedPlatforms: number[];
  };
  consoleFilters: {
    selectedBrands: string[];
    selectedGenerations: string[];
    selectedModels: string[];
    selectedTypes: string[];
    selectedMediaFormats: string[];
    selectedStorageRanges: string[];
    retroCompatible: boolean;
    selectedAllDigital: boolean;
  };
  accessoryFilters: {
    selectedTypes: string[];
    selectedSubTypes: string[];
    selectedConsoles: string[];
  };
  accessoriesPage: number;
  accessoriesPerPage: number;
  accessoriesSort: string;
}

interface UseMarketDataReturn {
  games: UserGame[];
  consoles: UserConsole[];
  accessories: UserAccessory[];
  gamesMeta: PaginationMeta | undefined;
  consolesMeta: PaginationMeta | undefined;
  accessoriesMeta: PaginationMeta | undefined;
  isLoading: boolean;
  gamesLoading: boolean;
  consolesLoading: boolean;
  accessoriesLoading: boolean;
  error: Error | null;
  gamesError: Error | null;
  consolesError: Error | null;
  accessoriesError: Error | null;
}

export function useMarketData({
  slug,
  locale,
  status,
  page,
  perPage,
  sort,
  searchQuery,
  gameFilters,
  consoleFilters,
  accessoryFilters,
  accessoriesPage,
  accessoriesPerPage,
  accessoriesSort,
}: UseMarketDataProps): UseMarketDataReturn {
  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
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
  );

  const {
    data: consolesData,
    isLoading: consolesLoading,
    error: consolesError,
  } = useUserConsolesPublic(
    slug,
    locale,
    status,
    page,
    perPage,
    sort,
    searchQuery,
    consoleFilters.selectedBrands.join(","),
    consoleFilters.selectedGenerations.join(","),
    consoleFilters.selectedModels.join(","),
    consoleFilters.selectedTypes.join(","),
    consoleFilters.selectedMediaFormats.join(","),
    consoleFilters.selectedStorageRanges.join(","),
    consoleFilters.retroCompatible,
    consoleFilters.selectedAllDigital,
    status,
  );

  const {
    data: accessoriesData,
    isLoading: accessoriesLoading,
    error: accessoriesError,
  } = useUserAccessoriesPublic(
    slug,
    accessoriesPage,
    accessoriesPerPage,
    accessoriesSort,
    status,
    accessoryFilters.selectedTypes.join(","),
    accessoryFilters.selectedSubTypes.join(","),
    accessoryFilters.selectedConsoles.join(","),
  );

  return {
    games: gamesData?.items || [],
    consoles: consolesData?.items || [],
    accessories: accessoriesData?.items || [],
    gamesMeta: gamesData?.meta,
    consolesMeta: consolesData?.meta,
    accessoriesMeta: accessoriesData?.meta,
    isLoading: gamesLoading || consolesLoading || accessoriesLoading,
    gamesLoading,
    consolesLoading,
    accessoriesLoading,
    error: gamesError || consolesError || accessoriesError || null,
    gamesError: gamesError || null,
    consolesError: consolesError || null,
    accessoriesError: accessoriesError || null,
  };
}
