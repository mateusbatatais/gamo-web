// src/components/molecules/SocialLoginButton/SocialLoginButton.tsx
"use client";

import React from "react";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { useMicrosoftLogin } from "@/hooks/useMicrosoftLogin";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { useTranslations } from "next-intl";
import { GoogleIcon } from "@/components/atoms/Icons/GoogleIcon";
import { MicrosoftIcon } from "@/components/atoms/Icons/MicrosoftIcon";
import { useToast } from "@/contexts/ToastContext";

interface SocialLoginButtonProps {
  provider: "google" | "microsoft" | "apple";
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
  const { showToast } = useToast();

  const { login: googleLogin, loading: googleLoading } = useGoogleLogin();
  const { login: microsoftLogin, loading: microsoftLoading } = useMicrosoftLogin();

  const loading =
    provider === "google" ? googleLoading : provider === "microsoft" ? microsoftLoading : false;

  const t = useTranslations("login");

  const handleLogin = async () => {
    try {
      let token;
      if (provider === "google") {
        token = await googleLogin();
      } else if (provider === "microsoft") {
        token = await microsoftLogin();
      } else {
        showToast("Provedor não suportado", "success");
        throw new Error("Provedor não suportado");
      }
      showToast("Bem vindo!", "success");
      if (onSuccess) onSuccess(token);
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), "danger");
      if (onError) onError(error as Error);
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
    microsoft: {
      text: t("microsoftButton"),
      icon: <MicrosoftIcon className="h-5 w-5 mr-2" aria-hidden="true" />,
      classes:
        "w-full h-10 bg-[#2F2F2F] border border-neutral-300 rounded-md text-white font-medium hover:bg-[#1E1E1E] transition disabled:opacity-50 disabled:cursor-not-allowed",
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
      className={`w-full flex items-center justify-center cursor-pointer ${classes} ${className}`}
      aria-label={text}
      data-testid={`social-login-${provider}`}
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
