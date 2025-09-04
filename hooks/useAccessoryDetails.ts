// hooks/useAccessoryDetails.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { AccessoryDetail } from "@/@types/catalog.types";

export default function useAccessoryDetails(slug: string, locale: string) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<AccessoryDetail, Error>({
    queryKey: ["accessoryDetails", slug, locale],
    queryFn: async () => {
      if (!slug || !initialized) throw new Error("Missing required parameters");

      return apiFetch(`/accessories/${slug}?locale=${locale}`);
    },
    enabled: !!slug && initialized,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });
}
