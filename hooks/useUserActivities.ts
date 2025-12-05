import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { RecentActivity } from "./useRecentActivities";

export function useUserActivities() {
  const { apiFetch } = useApiClient();
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-activities", user?.userId],
    queryFn: async () => {
      if (!user) return null;
      return await apiFetch<RecentActivity[]>("/user/me/activities");
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
