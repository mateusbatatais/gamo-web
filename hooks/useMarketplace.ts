// hooks/useMarketplace.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { MarketplaceItem, PaginatedResponse } from "@/@types/catalog.types";

interface UseMarketplaceOptions {
  page: number;
  perPage: number;
  sort?: string;
  itemType?: string[];
  status?: string;
  condition?: string[];
  searchQuery?: string;
}

export function useMarketplace({
  page,
  perPage,
  sort = "recent",
  itemType = [],
  status,
  condition = [],
  searchQuery = "",
}: UseMarketplaceOptions) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<PaginatedResponse<MarketplaceItem>, Error>({
    queryKey: [
      "marketplace",
      page,
      perPage,
      sort,
      itemType.join(","),
      status || "",
      condition.join(","),
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
      if (itemType.length > 0) params.append("itemType", itemType.join(","));
      if (status) params.append("status", status);
      if (condition.length > 0) params.append("condition", condition.join(","));

      return await apiFetch(`/market?${params.toString()}`);
    },
    enabled: initialized,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: (previousData) => previousData,
  });
}
