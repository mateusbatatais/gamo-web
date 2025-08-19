// hooks/usePlatforms.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface Platform {
  id: number;
  name: string;
}

export interface ParentPlatform {
  id: number;
  name: string;
  slug: string;
  platforms: Platform[];
}

export interface PlatformResponse {
  count: number;
  results: ParentPlatform[];
}

export default function usePlatforms() {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<PlatformResponse, Error>({
    queryKey: ["platforms"],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");
      return apiFetch("/games/platforms");
    },
    enabled: initialized,
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 dias
    retry: (failureCount, error) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
    placeholderData: (previousData) => previousData,
  });
}
