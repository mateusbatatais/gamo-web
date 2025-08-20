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
    mutationFn: async (data: UserGame) => {
      return apiFetch("/user-games", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Jogo adicionado à coleção com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["userGamesPublic"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao adicionar jogo", "danger");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UserGame }) => {
      return apiFetch(`/user-games/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Jogo atualizado com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["userGamesPublic"] });
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
