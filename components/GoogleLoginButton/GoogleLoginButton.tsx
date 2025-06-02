// components/GoogleLoginButton/GoogleLoginButton.tsx
"use client";

import React, { useState } from "react";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { apiFetch } from "@/utils/api";
import { useTranslations } from "next-intl";
import { GoogleIcon } from "../Icons/GoogleIcon";

export function GoogleLoginButton() {
  const { login: getIdToken } = useGoogleLogin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("login");

  const handleClick = async () => {
    setError(null);
    setLoading(true);
    try {
      // 1) Obter o ID Token do Firebase
      const idToken = await getIdToken();

      // 2) Enviar ao backend e receber o JWT do Gamo
      const { token } = await apiFetch<{ token: string }>(
        "/auth/social/google",
        {
          method: "POST",
          token: idToken,
        }
      );

      // 3) Armazenar e redirecionar
      localStorage.setItem("gamo_token", token);
      window.location.href = "/dashboard";
    } catch (e) {
      console.error(e);
      setError(t("errors.invalid"));
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`
          flex items-center justify-center 
          w-full h-10 
          bg-white border border-neutral-300 
          rounded-md 
          text-neutral-800 font-medium 
          hover:bg-neutral-100 
          dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800
          transition 
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <GoogleIcon className="h-5 w-5 mr-2" aria-hidden="true" />

        {loading ? t("loading") : t("googleButton")}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
