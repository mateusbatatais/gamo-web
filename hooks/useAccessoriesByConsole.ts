import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

interface AccessoryVariant {
  id: number;
  name: string;
  description?: string;
  editionName?: string;
  accessoryId: number;
  accessoryName: string;
  type: string;
  imageUrl?: string;
}

export function useAccessoryVariantsByConsole(consoleId: number) {
  const { apiFetch } = useApiClient();

  return useQuery({
    queryKey: ["accessoryVariantsByConsole", consoleId],
    queryFn: async (): Promise<AccessoryVariant[]> => {
      if (!consoleId) return [];

      return apiFetch(`/accessories/console/${consoleId}/variants`);
    },
    enabled: !!consoleId,
  });
}
