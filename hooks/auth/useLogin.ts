"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useApiClient } from "@/lib/api-client";
import { FieldError } from "@/@types/form.types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface ApiError {
  code?: string;
  message?: string;
  errors?: Record<string, FieldError>;
}

export function useLogin() {
  const { login } = useAuth();
  const { apiFetch } = useApiClient();

  return useMutation<LoginResponse, ApiError, LoginCredentials>({
    mutationFn: async (credentials) => {
      return apiFetch("/auth/login", {
        method: "POST",
        body: credentials,
      });
    },
    onSuccess: (data) => {
      login(data.token);
    },
  });
}
