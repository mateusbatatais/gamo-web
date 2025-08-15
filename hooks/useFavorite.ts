// src/hooks/useFavorite.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingAction } from "@/contexts/PendingActionContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import { FavoriteInput } from "@/@types/favorite";

interface FavoriteData {
  isFavorite: boolean;
}

export function useFavorite() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { setPendingAction } = usePendingAction();
  const { showToast } = useToast();
  const router = useRouter();
  const { apiFetch } = useApiClient();

  const mutation = useMutation({
    mutationFn: async (input: FavoriteInput) => {
      const response = await apiFetch<{
        code: "FAVORITE_ADDED" | "FAVORITE_REMOVED";
        message: string;
      }>("/favorites", {
        method: "POST",
        body: input,
      });

      return { added: response.code === "FAVORITE_ADDED" };
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["favorites", input.itemId] });
      const previousData = queryClient.getQueryData(["favorites", input.itemId]);

      queryClient.setQueryData(["favorites", input.itemId], (old: FavoriteData) => ({
        ...old,
        isFavorite: !old?.isFavorite,
      }));

      return { previousData };
    },
    onError: (error, input, context) => {
      queryClient.setQueryData(["favorites", input.itemId], context?.previousData);
      showToast(error instanceof Error ? error.message : "Erro ao atualizar favorito", "danger");
    },
    onSuccess: (result, input) => {
      showToast(
        result.added ? "Item adicionado aos favoritos" : "Item removido dos favoritos",
        "success",
      );
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
