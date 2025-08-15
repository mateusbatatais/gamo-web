// hooks/useConsoleDetails.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { ConsoleVariantDetail } from "@/@types/console";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export default function useConsoleDetails(slug: string, locale: string) {
  const { apiFetch } = useApiClient();
  const { initialized } = useAuth();

  return useQuery<ConsoleVariantDetail, Error>({
    queryKey: ["consoleDetails", slug, locale],
    queryFn: async () => {
      if (!slug || !initialized) throw new Error("Missing required parameters");

      return apiFetch(`/consoles/${slug}?locale=${locale}`, {
        // Não precisamos mais passar token explicitamente aqui
        // pois o useApiClient já injeta o token do contexto
      });
    },
    enabled: !!slug && initialized,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });
}
