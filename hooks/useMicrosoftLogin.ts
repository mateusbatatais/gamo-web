// src/hooks/useMicrosoftLogin.ts
"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, microsoftProvider } from "@/lib/firebase";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export const useMicrosoftLogin = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      const idToken = await result.user.getIdToken();

      // Usar o mesmo endpoint que o Google
      const backendResponse = await apiFetch<{ token: string }>("/auth/social-login", {
        method: "POST",
        token: idToken,
      });

      login(backendResponse.token);
      router.push("/account");

      return backendResponse.token;
    } catch (error) {
      console.error("Microsoft login failed:", error);

      // Tratamento específico de erros da Microsoft
      interface MicrosoftAuthError extends Error {
        code?: string;
      }
      let errorMessage = "Falha ao entrar com Microsoft";
      const msError = error as MicrosoftAuthError;
      if (msError.code === "popup_closed_by_user") {
        errorMessage = "Login cancelado pelo usuário";
      } else if (msError.code === "account_exists_with_different_credential") {
        errorMessage = "Conta já existe com credenciais diferentes";
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading };
};
