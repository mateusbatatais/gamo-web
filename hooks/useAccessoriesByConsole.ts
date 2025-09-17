// hooks/useAccessoriesByConsole.ts
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { AccessoryVariantDetail } from "@/@types/catalog.types";

export function useAccessoryVariantsByConsole(consoleId: number, enabled = true) {
  const { apiFetch } = useApiClient();

  return useQuery({
    queryKey: ["accessoryVariantsByConsole", consoleId],
    queryFn: async (): Promise<AccessoryVariantDetail[]> => {
      if (!consoleId) return [];
      return apiFetch(`/accessories/console/${consoleId}/variants`);
    },
    enabled: !!consoleId && enabled,
  });
}
