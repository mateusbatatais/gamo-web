import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserStats {
  games: number;
  consoles: number;
  accessories: number;
}

export function useUserStats() {
  const { apiFetch } = useApiClient();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-stats", user?.userId],
    queryFn: async () => {
      if (!user) return null;
      return await apiFetch<UserStats>("/users/me/stats");
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });
}
