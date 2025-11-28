// hooks/useConsoleData.ts
"use client";

import {
  useUserConsolesPublic,
  useUserAccessoriesPublic,
  useUserGamesPublic,
} from "@/hooks/usePublicProfile";
import { UserConsole, UserAccessory, UserGame } from "@/@types/collection.types";
import { PaginationMeta } from "@/@types/catalog.types";

interface UseConsoleDataProps {
  slug: string;
  locale: string;
  status: string;
  page: number;
  perPage: number;
  sort: string;
  searchQuery: string;
  consoleFilters: {
    selectedBrands: string[];
    selectedGenerations: string[];
    selectedModels: string[];
    selectedTypes: string[];
    selectedMediaFormats: string[];
    selectedStorageRanges: string[];
    retroCompatible: boolean;
    selectedAllDigital: boolean;
    showOnlyFavorites?: boolean;
  };
  accessoriesPage: number;
  accessoriesPerPage: number;
  accessoriesSort: string;
  gamesPage: number;
  gamesPerPage: number;
  gamesSort: string;
}

interface UseConsoleDataReturn {
  consoles: UserConsole[];
  accessories: UserAccessory[];
  games: UserGame[];
  consolesMeta: PaginationMeta | undefined;
  accessoriesMeta: PaginationMeta | undefined;
  gamesMeta: PaginationMeta | undefined;
  isLoading: boolean;
  consolesLoading: boolean;
  accessoriesLoading: boolean;
  gamesLoading: boolean;
  error: Error | null;
  consolesError: Error | null;
  accessoriesError: Error | null;
  gamesError: Error | null;
}

export function useConsoleData({
  slug,
  locale,
  status,
  page,
  perPage,
  sort,
  searchQuery,
  consoleFilters,
  accessoriesPage,
  accessoriesPerPage,
  accessoriesSort,
  gamesPage,
  gamesPerPage,
  gamesSort,
}: UseConsoleDataProps): UseConsoleDataReturn {
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
    consoleFilters.showOnlyFavorites,
  );

  const {
    data: accessoriesData,
    isLoading: accessoriesLoading,
    error: accessoriesError,
  } = useUserAccessoriesPublic(slug, accessoriesPage, accessoriesPerPage, accessoriesSort, status);

  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gamesError,
  } = useUserGamesPublic(
    slug,
    locale,
    status,
    gamesPage,
    gamesPerPage,
    gamesSort,
    "",
    [],
    [],
    false,
    true, // standalone = true
  );

  return {
    consoles: consolesData?.items || [],
    accessories: accessoriesData?.items || [],
    games: gamesData?.items || [],
    consolesMeta: consolesData?.meta,
    accessoriesMeta: accessoriesData?.meta,
    gamesMeta: gamesData?.meta,
    isLoading: consolesLoading || accessoriesLoading || gamesLoading,
    consolesLoading,
    accessoriesLoading,
    gamesLoading,
    error: consolesError || accessoriesError || gamesError || null,
    consolesError: consolesError || null,
    accessoriesError: accessoriesError || null,
    gamesError: gamesError || null,
  };
}
