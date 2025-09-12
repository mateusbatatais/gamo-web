// src/hooks/useUserAccessoryMutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserAccessory, UserConsole } from "@/@types/collection.types";
import { PaginatedResponse } from "@/@types/catalog.types";

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
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["userAccessoriesPublic"] });
      await queryClient.cancelQueries({ queryKey: ["userConsolesPublic"] });

      const previousAccessories = queryClient.getQueryData<PaginatedResponse<UserAccessory>>([
        "userAccessoriesPublic",
      ]);

      const previousConsoles = queryClient.getQueryData<PaginatedResponse<UserConsole>>([
        "userConsolesPublic",
      ]);

      if (previousAccessories) {
        queryClient.setQueryData<PaginatedResponse<UserAccessory>>(["userAccessoriesPublic"], {
          ...previousAccessories,
          items: previousAccessories.items.map((accessory) =>
            accessory.id === id ? { ...accessory, ...data } : accessory,
          ),
        });
      }

      if (previousConsoles) {
        queryClient.setQueryData<PaginatedResponse<UserConsole>>(["userConsolesPublic"], {
          ...previousConsoles,
          items: previousConsoles.items.map((console) => ({
            ...console,
            accessories: console.accessories?.map((acc) =>
              acc.id === id ? { ...acc, ...data } : acc,
            ),
          })),
        });
      }

      return { previousAccessories, previousConsoles };
    },
    onError: (err, variables, context) => {
      if (context?.previousAccessories) {
        queryClient.setQueryData(["userAccessoriesPublic"], context.previousAccessories);
      }
      if (context?.previousConsoles) {
        queryClient.setQueryData(["userConsolesPublic"], context.previousConsoles);
      }
      showToast("Erro ao atualizar acessório", "danger");
    },
    onSuccess: () => {
      showToast("Acessório atualizado com sucesso", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userAccessoriesPublic"] });
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
    },
  });

  return {
    createUserAccessory: createMutation.mutateAsync,
    updateUserAccessory: updateMutation.mutateAsync,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
