"use client";

import React, { useState } from "react";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";

export function GoogleLoginButton() {
  const { login: getIdToken } = useGoogleLogin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    setLoading(true);
    try {
      // 1) Obtém o ID Token do Firebase
      const idToken = await getIdToken();

      // 2) Envia para sua API e recebe o JWT do seu backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/social/google`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }
      const { token } = await res.json();

      // 3) Armazena o JWT (ex: localStorage) e redireciona
      localStorage.setItem("gamo_token", token);
      window.location.href = "/dashboard"; // ajuste para sua rota
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
