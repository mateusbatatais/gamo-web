"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { UserKit, CreateKitDTO } from "@/@types/collection.types";
import { useRouter } from "next/navigation";

export function useKitMutation() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: async (data: CreateKitDTO): Promise<UserKit> => {
      return apiFetch("/kits", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Kit criado com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["userKits"] });
      queryClient.invalidateQueries({ queryKey: ["userKitsPublic"] });
      router.push("/marketplace");
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao criar kit", "danger");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateKitDTO }): Promise<UserKit> => {
      return apiFetch(`/kits/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: () => {
      showToast("Kit atualizado com sucesso", "success");
      queryClient.invalidateQueries({ queryKey: ["userKits"] });
      queryClient.invalidateQueries({ queryKey: ["userKitsPublic"] });
      router.push("/marketplace");
    },
    onError: (error: Error) => {
      showToast(error.message || "Erro ao atualizar kit", "danger");
    },
  });

  return {
    createKit: createMutation.mutateAsync,
    updateKit: updateMutation.mutateAsync,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
