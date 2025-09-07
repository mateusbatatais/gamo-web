import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

interface UserConsoleSummary {
  id: number;
  name: string;
  consoleId: number;
  variantId: number;
  status: "OWNED" | "SELLING" | "LOOKING_FOR";
}

export function useUserConsoles(accessoryId?: number) {
  const { apiFetch } = useApiClient();

  return useQuery({
    queryKey: ["userConsolesSummary", accessoryId],
    queryFn: async (): Promise<UserConsoleSummary[]> => {
      const url = accessoryId ? `/user-consoles/summary/${accessoryId}` : "/user-consoles/summary";
      return apiFetch(url);
    },
    enabled: !!accessoryId,
  });
}
