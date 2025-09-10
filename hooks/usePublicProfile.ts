// src/hooks/usePublicProfile.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserAccessory, UserConsole, UserGame } from "@/@types/collection.types";
import { UserProfile } from "@/@types/auth.types";
import { PaginatedResponse } from "@/@types/catalog.types";

// Função auxiliar para converter ranges de storage em valores numéricos
function calculateStorageRange(ranges: string[]): { storageMin?: number; storageMax?: number } {
  if (ranges.length === 0) return {};

  let min = Infinity;
  let max = -Infinity;

  ranges.forEach((range) => {
    switch (range) {
      case "0-1":
        min = Math.min(min, 0);
        max = Math.max(max, 1);
        break;
      case "2-64":
        min = Math.min(min, 2);
        max = Math.max(max, 64);
        break;
      case "65-512":
        min = Math.min(min, 65);
        max = Math.max(max, 512);
        break;
      case "513-":
        min = Math.min(min, 513);
        max = Infinity;
        break;
    }
  });

  return {
    storageMin: min === Infinity ? undefined : min,
    storageMax: max === Infinity || max === -Infinity ? undefined : max,
  };
}

export function usePublicProfile(slug: string, locale: string) {
  const { apiFetch } = useApiClient();

  return useQuery<UserProfile>({
    queryKey: ["publicProfile", slug, locale],
    queryFn: () => apiFetch(`/public/profile/${slug}?locale=${locale}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserConsolesPublic(
  slug: string,
  locale: string,
  status?: string,
  page: number = 1,
  perPage: number = 20,
  sort?: string,
  search?: string,
  brand?: string,
  generation?: string,
  model?: string,
  type?: string,
  mediaFormats?: string,
  storageRanges?: string,
  retroCompatible?: boolean,
  allDigital?: boolean,
  accessoryStatus?: string,
) {
  const { apiFetch } = useApiClient();

  const queryParams = new URLSearchParams();
  queryParams.append("locale", locale);
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());
  if (sort) queryParams.append("sort", sort);
  if (search) queryParams.append("search", search);
  if (brand) queryParams.append("brand", brand);
  if (generation) queryParams.append("generation", generation);
  if (model) queryParams.append("model", model);
  if (type) queryParams.append("type", type);
  if (mediaFormats) queryParams.append("mediaFormats", mediaFormats);
  if (accessoryStatus) queryParams.append("accessoryStatus", accessoryStatus);

  queryParams.append("includeAccessories", "true");

  // Converter ranges de storage para storageMin e storageMax
  const rangesArray = storageRanges ? storageRanges.split(",").filter(Boolean) : [];
  const { storageMin, storageMax } = calculateStorageRange(rangesArray);
  if (storageMin !== undefined) queryParams.append("storageMin", storageMin.toString());
  if (storageMax !== undefined) queryParams.append("storageMax", storageMax.toString());

  if (retroCompatible !== undefined)
    queryParams.append("retroCompatible", retroCompatible.toString());
  if (allDigital) queryParams.append("allDigital", "true");

  return useQuery<PaginatedResponse<UserConsole>>({
    queryKey: [
      "userConsolesPublic",
      slug,
      locale,
      status,
      page,
      perPage,
      sort,
      search,
      brand,
      generation,
      model,
      type,
      mediaFormats,
      storageRanges,
      retroCompatible,
      allDigital,
      accessoryStatus,
    ],
    queryFn: () => apiFetch(`/public/profile/${slug}/consoles?${queryParams.toString()}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserGamesPublic(
  slug: string,
  locale: string,
  status?: string,
  page: number = 1,
  perPage: number = 20,
  sort?: string,
  search?: string,
  genres?: number[],
  platforms?: number[],
) {
  const { apiFetch } = useApiClient();

  const queryParams = new URLSearchParams();
  queryParams.append("locale", locale);
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());
  if (sort) queryParams.append("sort", sort);
  if (search) queryParams.append("search", search);
  if (genres && genres.length > 0) queryParams.append("genres", genres.join(","));
  if (platforms && platforms.length > 0) queryParams.append("platforms", platforms.join(","));

  return useQuery<PaginatedResponse<UserGame>>({
    queryKey: [
      "userGamesPublic",
      slug,
      locale,
      status,
      page,
      perPage,
      sort,
      search,
      genres,
      platforms,
    ],
    queryFn: () => apiFetch(`/public/profile/${slug}/games?${queryParams.toString()}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserAccessoriesPublic(
  slug: string,
  page: number = 1,
  perPage: number = 20,
  sort?: string,
  status?: string,
  types?: string,
  subTypes?: string,
  consoles?: string,
) {
  const { apiFetch } = useApiClient();

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());
  if (sort) queryParams.append("sort", sort);
  if (status) queryParams.append("status", status);
  if (types) queryParams.append("types", types);
  if (subTypes) queryParams.append("subTypes", subTypes);
  if (consoles) queryParams.append("consoles", consoles);

  return useQuery<PaginatedResponse<UserAccessory>>({
    queryKey: [
      "userAccessoriesPublic",
      slug,
      page,
      perPage,
      sort,
      status,
      types,
      subTypes,
      consoles,
    ],
    queryFn: () => apiFetch(`/public/profile/${slug}/accessories?${queryParams.toString()}`),
    staleTime: 5 * 60 * 1000,
  });
}
export function useDeleteUserGame() {
  const { apiFetch } = useApiClient();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => apiFetch(`/user-games/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: ["userGamesPublic"] });

      // Snapshot do valor anterior
      const previousGames = queryClient.getQueryData<UserGame[]>(["userGamesPublic"]);

      // Remove o item otimisticamente
      queryClient.setQueryData<UserGame[]>(
        ["userGamesPublic"],
        (old) => old?.filter((game) => game.id !== id) || [],
      );

      return { previousGames };
    },
    onError: (err, id, context) => {
      // Reverte para o valor anterior em caso de erro
      queryClient.setQueryData(["userGamesPublic"], context?.previousGames);
      showToast("Erro ao excluir jogo", "danger");
    },
    onSuccess: () => {
      showToast("Jogo excluído com sucesso", "success");
    },
    onSettled: () => {
      // Invalida para garantir sincronização com o servidor
      queryClient.invalidateQueries({ queryKey: ["userGamesPublic"] });
    },
  });
}

export function useDeleteUserConsole() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/user-consoles/${id}`, {
        method: "DELETE",
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["userConsolesPublic"] });

      const previousConsoles = queryClient.getQueryData<UserConsole[]>(["userConsolesPublic"]);

      queryClient.setQueryData<UserConsole[]>(
        ["userConsolesPublic"],
        (old) => old?.filter((console) => console.id !== id) || [],
      );

      return { previousConsoles };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["userConsolesPublic"], context?.previousConsoles);
      showToast("Erro ao excluir console", "danger");
    },
    onSuccess: () => {
      showToast("Console excluído com sucesso", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
    },
  });
}

export function useDeleteUserAccessory() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/user-accessories/${id}`, {
        method: "DELETE",
      }),
    onMutate: async (id) => {
      // Cancela queries em andamento para ambos os tipos de acessórios
      await queryClient.cancelQueries({ queryKey: ["userAccessoriesPublic"] });
      await queryClient.cancelQueries({ queryKey: ["userConsolesPublic"] });

      // Snapshot do valor anterior para acessórios avulsos
      const previousAccessories = queryClient.getQueryData<PaginatedResponse<UserAccessory>>([
        "userAccessoriesPublic",
      ]);

      // Snapshot do valor anterior para consoles (que contêm acessórios)
      const previousConsoles = queryClient.getQueryData<PaginatedResponse<UserConsole>>([
        "userConsolesPublic",
      ]);

      // Remove o acessório avulso otimisticamente
      if (previousAccessories) {
        queryClient.setQueryData<PaginatedResponse<UserAccessory>>(["userAccessoriesPublic"], {
          ...previousAccessories,
          items: previousAccessories.items.filter((accessory) => accessory.id !== id),
        });
      }

      // Remove o acessório dos consoles otimisticamente
      if (previousConsoles) {
        queryClient.setQueryData<PaginatedResponse<UserConsole>>(["userConsolesPublic"], {
          ...previousConsoles,
          items: previousConsoles.items.map((console) => ({
            ...console,
            accessories: console.accessories?.filter((acc) => acc.id !== id),
          })),
        });
      }

      return { previousAccessories, previousConsoles };
    },
    onError: (err, id, context) => {
      // Reverte para o valor anterior em caso de erro
      if (context?.previousAccessories) {
        queryClient.setQueryData(["userAccessoriesPublic"], context.previousAccessories);
      }
      if (context?.previousConsoles) {
        queryClient.setQueryData(["userConsolesPublic"], context.previousConsoles);
      }
      showToast("Erro ao excluir acessório", "danger");
    },
    onSuccess: () => {
      showToast("Acessório excluído com sucesso", "success");
    },
    onSettled: () => {
      // Invalida para garantir sincronização com o servidor
      queryClient.invalidateQueries({ queryKey: ["userAccessoriesPublic"] });
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
    },
  });
}
