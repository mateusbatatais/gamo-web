// src/hooks/usePublicProfile.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserConsole, UserGame } from "@/@types/collection.types";
import { UserProfile } from "@/@types/auth.types";

export function usePublicProfile(slug: string, locale: string) {
  const { apiFetch } = useApiClient();

  return useQuery<UserProfile>({
    queryKey: ["publicProfile", slug, locale],
    queryFn: () => apiFetch(`/public/profile/${slug}?locale=${locale}`),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useUserConsolesPublic(slug: string, locale: string) {
  const { apiFetch } = useApiClient();

  return useQuery<UserConsole[]>({
    queryKey: ["userConsolesPublic", slug, locale],
    queryFn: () => apiFetch(`/public/profile/${slug}/consoles?locale=${locale}`),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useUserGamesPublic(slug: string, locale: string) {
  const { apiFetch } = useApiClient();

  return useQuery<UserGame[]>({
    queryKey: ["userGamesPublic", slug, locale],
    queryFn: () => apiFetch(`/public/profile/${slug}/games?locale=${locale}`),
    staleTime: 5 * 60 * 1000, // 5 minutos
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
