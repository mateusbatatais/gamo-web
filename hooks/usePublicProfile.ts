// src/hooks/usePublicProfile.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { PublicUserProfile, UserConsolePublic, UserGamePublic } from "@/@types/publicProfile";
import { useToast } from "@/contexts/ToastContext";

export function usePublicProfile(slug: string, locale: string) {
  const { apiFetch } = useApiClient();

  return useQuery<PublicUserProfile>({
    queryKey: ["publicProfile", slug, locale],
    queryFn: () => apiFetch(`/public/profile/${slug}?locale=${locale}`),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useUserConsolesPublic(slug: string, locale: string) {
  const { apiFetch } = useApiClient();

  return useQuery<UserConsolePublic[]>({
    queryKey: ["userConsolesPublic", slug, locale],
    queryFn: () => apiFetch(`/public/profile/${slug}/consoles?locale=${locale}`),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useUserGamesPublic(slug: string, locale: string) {
  const { apiFetch } = useApiClient();

  return useQuery<UserGamePublic[]>({
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
      const previousGames = queryClient.getQueryData<UserGamePublic[]>(["userGamesPublic"]);

      // Remove o item otimisticamente
      queryClient.setQueryData<UserGamePublic[]>(
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

      const previousConsoles = queryClient.getQueryData<UserConsolePublic[]>([
        "userConsolesPublic",
      ]);

      queryClient.setQueryData<UserConsolePublic[]>(
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
