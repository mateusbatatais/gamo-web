import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export interface RecentActivity {
  id: number;
  type: "GAME" | "CONSOLE" | "ACCESSORY";
  action: "ADDED" | "LISTED";
  itemName: string;
  itemImage: string | null;
  userName: string;
  userSlug: string;
  userImage: string | null;
  createdAt: string;
}

export function useRecentActivities() {
  const { apiFetch } = useApiClient();

  return useQuery({
    queryKey: ["recent-activities"],
    queryFn: async () => {
      return await apiFetch<RecentActivity[]>("/user/activities");
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
