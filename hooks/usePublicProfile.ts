// src/hooks/usePublicProfile.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserConsole, UserGame } from "@/@types/collection.types";
import { UserProfile } from "@/@types/auth.types";
import { PaginatedResponse } from "@/@types/catalog.types";

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
  allDigital?: boolean,
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
      allDigital,
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
) {
  const { apiFetch } = useApiClient();

  const queryParams = new URLSearchParams();
  queryParams.append("locale", locale);
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("perPage", perPage.toString());
  if (sort) queryParams.append("sort", sort);
  if (search) queryParams.append("search", search);

  return useQuery<PaginatedResponse<UserGame>>({
    queryKey: ["userGamesPublic", slug, locale, status, page, perPage, sort, search],
    queryFn: () => apiFetch(`/public/profile/${slug}/games?${queryParams.toString()}`),
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
