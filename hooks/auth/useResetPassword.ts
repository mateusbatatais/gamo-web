// src/hooks/auth/useResetPassword.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useApiClient } from "@/lib/api-client";
import { useLocale } from "next-intl";

interface ResetPasswordParams {
  token: string;
  newPassword: string;
  locale: string;
}

export function useResetPassword() {
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const router = useRouter();
  const locale = useLocale();

  return useMutation<void, { code?: string; message?: string }, ResetPasswordParams>({
    mutationFn: async ({ token, newPassword }) => {
      return apiFetch("/auth/reset-password", {
        method: "POST",
        body: { token, newPassword, locale },
      });
    },
    onSuccess: () => {
      showToast("resetPassword.successMessage", "success", undefined, true);
      router.push("/login");
    },
  });
}
