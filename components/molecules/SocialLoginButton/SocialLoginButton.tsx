// src/components/molecules/SocialLoginButton/SocialLoginButton.tsx
"use client";

import React from "react";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { useTranslations } from "next-intl";
import { GoogleIcon } from "@/components/atoms/Icons/GoogleIcon";

interface SocialLoginButtonProps {
  provider: "google" | "facebook" | "apple";
  className?: string;
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  className = "",
  onSuccess,
  onError,
}) => {
  const { login, loading } = useGoogleLogin();
  const t = useTranslations("login");

  const handleLogin = async () => {
    try {
      const token = await login();
      if (onSuccess) onSuccess(token);
    } catch (error) {
      console.error("Social login failed:", error);

      let errorMessage = t("errors.googleLoginFailed");

      // Tratamento de erros específicos
      if (error instanceof Error) {
        if (error.message.includes("popup-closed-by-user")) {
          errorMessage = t("errors.popupClosed");
        } else if (error.message.includes("account-exists")) {
          errorMessage = t("errors.accountExists");
        } else if (error.message.includes("invalid_token")) {
          errorMessage = t("errors.invalidToken");
        }
      }

      if (onError) onError(new Error(errorMessage));
    }
  };

  // Configurações específicas por provider
  const providerConfig = {
    google: {
      text: t("googleButton"),
      icon: <GoogleIcon className="h-5 w-5 mr-2" aria-hidden="true" />,
      classes:
        "w-full h-10 bg-white border border-neutral-300 rounded-md text-neutral-800 font-medium hover:bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed",
    },
    facebook: {
      text: "Facebook",
      icon: <div>FB</div>,
      classes: "",
    },
    apple: {
      text: "Apple",
      icon: <div></div>,
      classes: "",
    },
  };

  const { text, icon, classes } = providerConfig[provider];

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`w-full flex items-center justify-center ${classes} ${className}`}
      aria-label={text}
    >
      {loading ? (
        <div className="flex items-center">
          <Spinner className="h-5 w-5 mr-2" />
          {t("loading")}
        </div>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </button>
  );
};
