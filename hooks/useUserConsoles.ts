import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

interface UserConsoleSummary {
  id: number;
  name: string;
  consoleId: number;
  variantId: number;
  status: "OWNED" | "SELLING" | "LOOKING_FOR";
}

export function useUserConsoles() {
  const { apiFetch } = useApiClient();

  return useQuery({
    queryKey: ["userConsolesSummary"],
    queryFn: async (): Promise<UserConsoleSummary[]> => {
      return apiFetch("/user-consoles/summary");
    },
  });
}
