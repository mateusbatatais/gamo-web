// src/hooks/useUserAccessoryMutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserAccessory } from "@/@types/collection.types";

export function useUserAccessoryMutation() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: Partial<UserAccessory> & { compatibleUserConsoleIds?: number[] }) => {
      return apiFetch("/user-accessories", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Acessório adicionado à coleção com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["userAccessories"] });
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao adicionar acessório", "danger");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UserAccessory> }) => {
      return apiFetch(`/user-accessories/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Acessório atualizado com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["userAccessories"] });
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao atualizar acessório", "danger");
    },
  });

  return {
    createUserAccessory: createMutation.mutateAsync,
    updateUserAccessory: updateMutation.mutateAsync,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
