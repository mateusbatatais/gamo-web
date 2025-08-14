// src/hooks/auth/useSignup.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useApiClient } from "@/lib/api-client";

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  locale: string;
}

interface SignupResponse {
  userId: string;
  code?: string;
}

export function useSignup() {
  const { apiFetch } = useApiClient();
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation<SignupResponse, { code?: string; message?: string }, SignupCredentials>({
    mutationFn: async (credentials) => {
      return apiFetch("/auth/signup", {
        method: "POST",
        body: credentials,
      });
    },
    onSuccess: (data, variables) => {
      if (data.code === "USER_CREATED_EMAIL_FAILED") {
        showToast("signup.emailSendError", "warning", undefined, true);
      } else {
        showToast("signup.success.title", "success", undefined, true);
      }
      router.push(`/signup/success?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      // O tratamento global de erros pode ser feito aqui
      console.error("Signup error:", error);
    },
  });
}
