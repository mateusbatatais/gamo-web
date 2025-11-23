"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { MarketItem, PaginatedResponse } from "@/@types/catalog.types";

export default function useConsoleMarket(slug: string) {
  const { apiFetch } = useApiClient();

  return useQuery<PaginatedResponse<MarketItem>, Error>({
    queryKey: ["consoleMarket", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Missing required parameters");

      return apiFetch(`/user-consoles/market/variant/${slug}`);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
