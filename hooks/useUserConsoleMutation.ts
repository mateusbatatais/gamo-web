// src/hooks/useUserConsoleMutation.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserConsole } from "@/@types/collection.types";

interface UserConsoleResponse {
  code: string;
  message: string;
  userConsole: UserConsole;
}

export function useUserConsoleMutation() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationKey: ["createUserConsole"],
    mutationFn: async (data: UserConsole): Promise<UserConsoleResponse> => {
      return apiFetch("/user-consoles", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (response) => {
      showToast(response.message || "Console adicionado à coleção com sucesso", "success");
      // Invalidate todas as queries de consoles públicos
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao adicionar console", "danger");
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["updateUserConsole"],
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UserConsole;
    }): Promise<UserConsoleResponse> => {
      return apiFetch(`/user-consoles/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: (response) => {
      showToast(response.message || "Console atualizado com sucesso", "success");
      // Invalidate todas as queries de consoles públicos
      queryClient.invalidateQueries({ queryKey: ["userConsolesPublic"] });
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao atualizar console", "danger");
    },
  });

  return {
    createUserConsole: createMutation.mutateAsync,
    updateUserConsole: updateMutation.mutateAsync,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
