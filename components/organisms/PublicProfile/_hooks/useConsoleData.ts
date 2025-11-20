// hooks/useConsoleData.ts
"use client";

import { useUserConsolesPublic, useUserAccessoriesPublic } from "@/hooks/usePublicProfile";
import { UserConsole, UserAccessory } from "@/@types/collection.types";
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
}

interface UseConsoleDataReturn {
  consoles: UserConsole[];
  accessories: UserAccessory[];
  consolesMeta: PaginationMeta | undefined;
  accessoriesMeta: PaginationMeta | undefined;
  isLoading: boolean;
  consolesLoading: boolean;
  accessoriesLoading: boolean;
  error: Error | null;
  consolesError: Error | null;
  accessoriesError: Error | null;
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

  return {
    consoles: consolesData?.items || [],
    accessories: accessoriesData?.items || [],
    consolesMeta: consolesData?.meta,
    accessoriesMeta: accessoriesData?.meta,
    isLoading: consolesLoading || accessoriesLoading,
    consolesLoading,
    accessoriesLoading,
    error: consolesError || accessoriesError || null,
    consolesError: consolesError || null,
    accessoriesError: accessoriesError || null,
  };
}
