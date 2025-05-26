// components/GoogleLoginButton/GoogleLoginButton.tsx
"use client";

import React, { useState } from "react";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { useLocale } from "next-intl";

export function GoogleLoginButton() {
  const { login: getIdToken } = useGoogleLogin();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    setLoading(true);
    try {
      const idToken = await getIdToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/social/google`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const { token } = await res.json();
      localStorage.setItem("gamo_token", token);
      // redireciona para dashboard no mesmo locale
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
