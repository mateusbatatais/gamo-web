// src/hooks/auth/useRecoverPassword.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/contexts/ToastContext";
import { useApiClient } from "@/lib/api-client";

export function useRecoverPassword() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();

  return useMutation<void, { code?: string; message?: string }, { email: string }>({
    mutationFn: async ({ email }) => {
      return apiFetch("/auth/recover", {
        method: "POST",
        body: { email },
      });
    },
    onSuccess: () => {
      showToast("recover.successGenericMessage", "success", undefined, true);
    },
  });
}
