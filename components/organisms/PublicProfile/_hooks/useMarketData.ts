// hooks/useMarketData.ts
"use client";

import {
  useUserGamesPublic,
  useUserConsolesPublic,
  useUserAccessoriesPublic,
  useUserKitsPublic,
} from "@/hooks/usePublicProfile";
import { UserGame, UserConsole, UserAccessory, UserKit } from "@/@types/collection.types";
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
  kits: UserKit[];
  gamesMeta: PaginationMeta | undefined;
  consolesMeta: PaginationMeta | undefined;
  accessoriesMeta: PaginationMeta | undefined;
  kitsMeta: PaginationMeta | undefined;
  isLoading: boolean;
  gamesLoading: boolean;
  consolesLoading: boolean;
  accessoriesLoading: boolean;
  kitsLoading: boolean;
  error: Error | null;
  gamesError: Error | null;
  consolesError: Error | null;
  accessoriesError: Error | null;
  kitsError: Error | null;
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

  const {
    data: kitsData,
    isLoading: kitsLoading,
    error: kitsError,
  } = useUserKitsPublic(slug, page, perPage, sort, status);

  return {
    games: gamesData?.items || [],
    consoles: consolesData?.items || [],
    accessories: accessoriesData?.items || [],
    kits: kitsData?.items || [],
    gamesMeta: gamesData?.meta,
    consolesMeta: consolesData?.meta,
    accessoriesMeta: accessoriesData?.meta,
    kitsMeta: kitsData?.meta,
    isLoading: gamesLoading || consolesLoading || accessoriesLoading || kitsLoading,
    gamesLoading,
    consolesLoading,
    accessoriesLoading,
    kitsLoading,
    error: gamesError || consolesError || accessoriesError || kitsError || null,
    gamesError: gamesError || null,
    consolesError: consolesError || null,
    accessoriesError: accessoriesError || null,
    kitsError: kitsError || null,
  };
}
