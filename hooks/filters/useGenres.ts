// hooks/useGenres.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface GenreResult {
  id: number;
  name: string;
}

export interface GenreResponse {
  count: number;
  results: GenreResult[];
}

export default function useGenres() {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<GenreResponse, Error>({
    queryKey: ["genres"],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");
      return apiFetch("/games/genres");
    },
    enabled: initialized,
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 dias
    retry: (failureCount, error) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });
}
