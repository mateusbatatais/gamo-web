// src/hooks/useUserGameMutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserGame } from "@/@types/collection.types";

export function useUserGameMutation() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationKey: ["createUserGame"],
    mutationFn: async (data: UserGame) => {
      return apiFetch("/user-games", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Jogo adicionado à coleção com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["userGamesPublic"] });
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao adicionar jogo", "danger");
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["updateUserGame"],
    mutationFn: async ({ id, data }: { id: number; data: UserGame }) => {
      return apiFetch(`/user-games/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Jogo atualizado com sucesso", "success");
      // Invalidar queries de games
      queryClient.invalidateQueries({ queryKey: ["userGamesPublic"] });
      // Invalidar queries de consoles para atualizar a lista de games associados
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
      // Invalidar query de game específico (usado no modal de edição)
      queryClient.invalidateQueries({ queryKey: ["userGame"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao atualizar jogo", "danger");
    },
  });

  return {
    createUserGame: createMutation.mutateAsync,
    updateUserGame: updateMutation.mutateAsync,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
