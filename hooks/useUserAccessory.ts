"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { UserAccessory } from "@/@types/collection.types";

export function useUserAccessory(id: number, options?: { enabled?: boolean }) {
  const { apiFetch } = useApiClient();

  return useQuery<UserAccessory>({
    queryKey: ["userAccessory", id],
    queryFn: () => apiFetch(`/user-accessories/${id}`),
    enabled: options?.enabled && !!id,
  });
}
