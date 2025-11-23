"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { MarketItem, PaginatedResponse } from "@/@types/catalog.types";

export default function useAccessoryMarket(slug: string) {
  const { apiFetch } = useApiClient();

  return useQuery<PaginatedResponse<MarketItem>, Error>({
    queryKey: ["accessoryMarket", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Missing required parameters");

      return apiFetch(`/user-accessories/market/variant/${slug}`);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
