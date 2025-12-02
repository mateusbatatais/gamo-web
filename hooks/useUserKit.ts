import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { UserKit } from "@/@types/collection.types";

export function useUserKit(id: number, locale: string = "pt") {
  const { apiFetch } = useApiClient();

  return useQuery<UserKit>({
    queryKey: ["userKit", id, locale],
    queryFn: () => apiFetch(`/kits/${id}?locale=${locale}`),
    enabled: !!id,
  });
}
