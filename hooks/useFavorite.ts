// src/hooks/useFavorite.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/lib/api/favorites";
import { FavoriteInput } from "@/@types/favorite";
interface FavoriteData {
  isFavorite: boolean;
}
export function useFavorite() {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  const { setPendingAction } = usePendingAction();
  const { showToast } = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (input: FavoriteInput) => {
      if (!token) throw new Error("Not authenticated");
      return await toggleFavorite(token, input);
    },
    onMutate: async (input) => {
      // Cancelar queries relacionadas para evitar conflitos
      await queryClient.cancelQueries({ queryKey: ["favorites", input.itemId] });

      // Snapshot do valor anterior
      const previousData = queryClient.getQueryData(["favorites", input.itemId]);

      // Atualização otimista
      queryClient.setQueryData(["favorites", input.itemId], (old: FavoriteData) => ({
        ...old,
        isFavorite: !old?.isFavorite,
      }));

      return { previousData };
    },
    onError: (error, input, context) => {
      // Reverter para o valor anterior em caso de erro
      queryClient.setQueryData(["favorites", input.itemId], context?.previousData);

      const message = error instanceof Error ? error.message : "Erro ao atualizar favorito";
      showToast(message, "danger");
    },
    onSuccess: (result, input) => {
      showToast(
        result.added ? "Item adicionado aos favoritos" : "Item removido dos favoritos",
        "success",
      );
      // Invalidar queries relacionadas para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ["favorites", input.itemId] });
      queryClient.invalidateQueries({ queryKey: ["consoleDetails"] });
    },
  });

  const handleToggleFavorite = async (input: FavoriteInput) => {
    if (!user) {
      setPendingAction({
        type: "TOGGLE_FAVORITE",
        payload: input,
      });
      const returnUrl = `${window.location.pathname}${window.location.search}`;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return { added: false };
    }

    return mutation.mutateAsync(input);
  };

  return {
    toggleFavorite: handleToggleFavorite,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
