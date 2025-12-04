import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export interface TopUser {
  id: number;
  name: string;
  slug: string;
  profileImage: string | null;
  totalItems: number;
  latestItems: string[];
}

export function useTopUsers(type: "COLLECTION" | "SELLING") {
  const { apiFetch } = useApiClient();

  return useQuery({
    queryKey: ["top-users", type],
    queryFn: async () => {
      return await apiFetch<TopUser[]>(`/user/top?type=${type}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
