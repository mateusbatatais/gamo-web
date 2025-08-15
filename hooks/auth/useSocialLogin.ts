"use client";

import { useMutation } from "@tanstack/react-query";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, microsoftProvider } from "@/lib/firebase";
import { useApiClient } from "@/lib/api-client";
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

interface SocialLoginResponse {
  token: string;
}

export const useSocialLogin = ({ provider, errorMessages = {} }: SocialLoginOptions) => {
  const { login: authLogin } = useAuth();
  const { apiFetch } = useApiClient();
  const router = useRouter();
  const locale = useLocale();

  const mutation = useMutation<SocialLoginResponse, Error, void>({
    mutationFn: async () => {
      const selectedProvider = provider === "Google" ? googleProvider : microsoftProvider;
      const result = await signInWithPopup(auth, selectedProvider);
      const idToken = await result.user.getIdToken();

      return apiFetch<SocialLoginResponse>("/auth/social-login", {
        method: "POST",
        body: { locale },
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    },
    onSuccess: (data) => {
      authLogin(data.token);
      const returnUrl = new URLSearchParams(window.location.search).get("returnUrl");
      router.push(returnUrl || "/account");
    },
  });

  const handleLogin = async () => {
    try {
      await mutation.mutateAsync();
      return mutation.data?.token;
    } catch (error) {
      let errorMessage = errorMessages.default || "Falha ao entrar";
      const socialError = error as { code?: string };

      if (socialError.code === "popup_closed_by_user") {
        errorMessage = errorMessages.popupClosedByUser || "Login cancelado pelo usuário";
      } else if (socialError.code === "account_exists_with_different_credential") {
        errorMessage =
          errorMessages.accountExistsWithDifferentCredential ||
          "Conta já existe com credenciais diferentes";
      }
      throw new Error(errorMessage);
    }
  };

  return {
    login: handleLogin,
    loading: mutation.isPending,
    error: mutation.error,
  };
};
