// hooks/useAccessories.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { Accessory, PaginatedResponse } from "@/@types/catalog.types";

interface UseAccessoriesOptions {
  locale: string;
  page: number;
  perPage: number;
  sort?: string;
  selectedTypes?: string[];
  selectedSubTypes?: string[];
  selectedConsoles?: string[];
  searchQuery?: string;
}

export function useAccessories({
  locale,
  page,
  perPage,
  sort = "name-asc",
  selectedTypes = [],
  selectedSubTypes = [],
  selectedConsoles = [], // Agora são os slugs dos consoles, não das marcas
  searchQuery = "",
}: UseAccessoriesOptions) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<PaginatedResponse<Accessory>, Error>({
    queryKey: [
      "accessories",
      locale,
      page,
      perPage,
      sort,
      selectedTypes.join(","),
      selectedSubTypes.join(","),
      selectedConsoles.join(","), // Agora são os slugs dos consoles
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
      if (selectedTypes.length > 0) params.append("type", selectedTypes.join(","));
      if (selectedSubTypes.length > 0) params.append("subType", selectedSubTypes.join(","));
      if (selectedConsoles.length > 0) params.append("console", selectedConsoles.join(",")); // Agora envia os slugs dos consoles
      if (searchQuery) params.append("search", searchQuery);

      return apiFetch(`/accessories?${params.toString()}`);
    },
    enabled: initialized,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
