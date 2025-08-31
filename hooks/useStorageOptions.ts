// hooks/useStorageOptions.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { StorageOption } from "@/@types/catalog.types";

export function useStorageOptions(consoleVariantId?: number) {
  const { apiFetch } = useApiClient();

  return useQuery<StorageOption[], Error>({
    queryKey: ["storageOptions", consoleVariantId],
    queryFn: async () => {
      if (!consoleVariantId) {
        return [];
      }

      return apiFetch(`/consoles/variants/${consoleVariantId}/storage-options`);
    },
    enabled: !!consoleVariantId,
  });
}
