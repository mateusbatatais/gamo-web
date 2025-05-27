// components/GoogleLoginButton/GoogleLoginButton.tsx
"use client";

import React, { useState } from "react";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { useLocale } from "next-intl";
import { apiFetch } from "@/utils/api";

export function GoogleLoginButton() {
  const { login: getIdToken } = useGoogleLogin();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      window.location.href = `/${locale}/dashboard`;
    } catch (e) {
      console.error(e);
      setError("Falha no login. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Entrar com Google"}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
