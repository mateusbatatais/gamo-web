// src/hooks/useUserConsoleMutation.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserConsoleInput, UserConsoleUpdate } from "@/@types/userConsole";
import { useRouter } from "next/navigation";

export function useUserConsoleMutation() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: async (data: UserConsoleInput) => {
      return apiFetch("/user-consoles", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Console adicionado à coleção com sucesso", "success");
      router.refresh();
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao adicionar console", "danger");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UserConsoleUpdate }) => {
      return apiFetch(`/user-consoles/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Console atualizado com sucesso", "success");
      router.refresh();
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
