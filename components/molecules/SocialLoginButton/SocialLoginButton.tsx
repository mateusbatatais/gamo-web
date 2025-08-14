"use client";

import React from "react";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { useTranslations } from "next-intl";
import { GoogleIcon } from "@/components/atoms/Icons/GoogleIcon";
import { MicrosoftIcon } from "@/components/atoms/Icons/MicrosoftIcon";
import { useToast } from "@/contexts/ToastContext";
import { useSocialLogin } from "@/hooks/auth/useSocialLogin";

interface SocialLoginButtonProps {
  provider: "google" | "microsoft" | "apple";
  className?: string;
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
  returnUrl?: string;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  className = "",
  onSuccess,
  onError,
  returnUrl,
}) => {
  const { showToast } = useToast();
  const t = useTranslations("login");

  const { login, loading, error } = useSocialLogin({
    provider: provider === "google" ? "Google" : "Microsoft",
    errorMessages: {
      popupClosedByUser: t("errors.socialPopupClosed"),
      accountExistsWithDifferentCredential: t("errors.socialAccountExists"),
      default: t("errors.socialLoginFailed"),
    },
  });

  React.useEffect(() => {
    if (error) {
      showToast(error.message, "danger");
      onError?.(error);
    }
  }, [error, showToast, onError]);

  const handleLogin = async () => {
    try {
      const token = await login();
      if (token) {
        showToast(t("welcome"), "success");
        onSuccess?.(token);
        if (returnUrl) {
          window.location.href = returnUrl;
        }
      }
    } catch {
      // Errors are already handled by the effect above
    }
  };

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
      type="button"
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
