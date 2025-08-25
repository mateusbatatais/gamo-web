// src/hooks/useConsoles.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { ConsoleVariant, PaginatedResponse } from "@/@types/catalog.types";

// src/hooks/useConsoles.ts
interface UseConsolesOptions {
  locale: string;
  page: number;
  perPage: number;
  sort?: string;
  selectedBrands?: string[];
  selectedGenerations?: string[];
  selectedModels?: string[];
  selectedTypes?: string[];
  selectedAllDigital?: boolean;
  searchQuery?: string;
}

export function useConsoles({
  locale,
  page,
  perPage,
  sort = "releaseDate-desc",
  selectedBrands = [],
  selectedGenerations = [],
  selectedModels = [],
  selectedTypes = [],
  selectedAllDigital = false,
  searchQuery = "",
}: UseConsolesOptions) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<PaginatedResponse<ConsoleVariant>, Error>({
    queryKey: [
      "consoles",
      locale,
      page,
      perPage,
      sort,
      selectedBrands.join(","),
      selectedGenerations.join(","),
      selectedModels.join(","),
      selectedTypes.join(","),
      selectedAllDigital,
      searchQuery,
    ],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");

      const params = new URLSearchParams({
        locale,
        page: page.toString(),
        perPage: perPage.toString(),
      });

      if (sort) params.append("sort", sort);
      if (selectedBrands.length > 0) params.append("brand", selectedBrands.join(","));
      if (selectedGenerations.length > 0)
        params.append("generation", selectedGenerations.join(","));
      if (selectedModels.length > 0) params.append("model", selectedModels.join(","));
      if (selectedTypes.length > 0) params.append("type", selectedTypes.join(","));
      if (selectedAllDigital) params.append("allDigital", "true");
      if (searchQuery) params.append("search", searchQuery);

      return apiFetch(`/consoles?${params.toString()}`);
    },
    enabled: initialized,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
