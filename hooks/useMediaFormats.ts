// hooks/filters/useMediaFormats.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface MediaFormat {
  slug: string;
  name: string;
  id: number;
}

export default function useMediaFormats() {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<MediaFormat[], Error>({
    queryKey: ["mediaFormats"],
    queryFn: async () => {
      if (!initialized) throw new Error("Auth not initialized");
      return apiFetch("/consoles/media-formats/list");
    },
    enabled: initialized,
    staleTime: 30 * 24 * 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });
}
