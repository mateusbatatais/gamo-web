import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

interface CompatibleUserConsole {
  id: number;
  console: {
    id: number;
    slug: string;
    name: string;
  };
  variant: {
    id: number;
    slug: string;
    name: string;
  };
  status: "OWNED" | "SELLING" | "LOOKING_FOR" | "PREVIOUSLY_OWNED";
  price?: number | null;
}

export function useCompatibleUserConsoles(
  gameSlug?: string,
  platformId?: number,
  locale: string = "pt",
) {
  const { apiFetch } = useApiClient();

  return useQuery({
    queryKey: ["user-consoles", "compatible", gameSlug, platformId, locale],
    queryFn: async () => {
      if (!gameSlug) return [];
      const params = new URLSearchParams({ locale });
      if (platformId) {
        params.append("platformId", platformId.toString());
      }
      return apiFetch<CompatibleUserConsole[]>(
        `/user-consoles/compatible/${gameSlug}?${params.toString()}`,
      );
    },
    enabled: !!gameSlug,
  });
}
