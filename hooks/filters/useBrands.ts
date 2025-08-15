// hooks/useBrands.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface Brand {
  slug: string;
  id: number;
}

export default function useBrands() {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<Brand[], Error>({
    queryKey: ["brands"],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");
      return apiFetch("/brands");
    },
    enabled: initialized,
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 dias
    retry: (failureCount, error) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });
}
