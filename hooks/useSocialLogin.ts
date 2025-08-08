"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, microsoftProvider } from "@/lib/firebase";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface SocialLoginOptions {
  provider: "Google" | "Microsoft";
  errorMessages?: {
    default?: string;
    popupClosedByUser?: string;
    accountExistsWithDifferentCredential?: string;
  };
}

export const useSocialLogin = ({ provider, errorMessages = {} }: SocialLoginOptions) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  const handleLogin = async () => {
    setLoading(true);
    try {
      let selectedProvider;
      if (provider === "Google") {
        selectedProvider = googleProvider;
      } else if (provider === "Microsoft") {
        selectedProvider = microsoftProvider;
      } else {
        throw new Error("Provider inválido: " + provider);
      }
      const result = await signInWithPopup(auth, selectedProvider);
      const idToken = await result.user.getIdToken();

      const backendResponse = await apiFetch<{ token: string }>("/auth/social-login", {
        method: "POST",
        token: idToken,
        body: { locale },
      });

      login(backendResponse.token);
      const returnUrl = new URLSearchParams(window.location.search).get("returnUrl");

      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push("/account");
      }
      return backendResponse.token;
    } catch (error) {
      console.error("Social login failed:", error);
      // Tratamento de erros customizado
      interface SocialAuthError extends Error {
        code?: string;
      }
      let errorMessage = errorMessages.default || "Falha ao entrar";
      const socialError = error as SocialAuthError;
      if (socialError.code === "popup_closed_by_user") {
        errorMessage = errorMessages.popupClosedByUser || "Login cancelado pelo usuário";
      } else if (socialError.code === "account_exists_with_different_credential") {
        errorMessage =
          errorMessages.accountExistsWithDifferentCredential ||
          "Conta já existe com credenciais diferentes";
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading };
};
