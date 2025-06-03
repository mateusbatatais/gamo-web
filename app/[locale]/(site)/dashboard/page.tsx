// app/[locale]/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const t = useTranslations("");
  const router = useRouter();
  const { token, initialized, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // 3) Se chegamos aqui, `token` existe: buscamos o perfil
  useEffect(() => {
    // Só busca perfil se contexto estiver inicializado e houver token
    if (!initialized || !token) return;
    apiFetch<UserProfile>("/user/profile", { token })
      .then((data) => setProfile(data))
      .catch(() => {
        // Se der erro (ex. 401), desloga e manda para login
        logout();
        router.replace("/login");
      })
      .finally(() => setLoadingProfile(false));
  }, [token, logout, router, initialized]);

  // 1) Enquanto o contexto não estiver inicializado, mostra loading
  if (!initialized) {
    return <div>{t("common.loading")}</div>;
  }

  // 2) Se estiver inicializado mas não houver token, redireciona para login
  if (!token) {
    router.replace("/login");
    return null;
  }

  // 4) Enquanto carregamos o perfil, mostra loading
  if (loadingProfile) {
    return <div>{t("common.loading")}</div>;
  }

  // 5) Se, depois de carregar, não houver profile (por segurança), exibe erro + botão de logout
  if (!profile) {
    return (
      <div>
        {t("common.error")}{" "}
        <button
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="mt-4 px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300"
        >
          {t("common.logout")}
        </button>
      </div>
    );
  }

  // 6) Se chegamos aqui, temos profile pronto e token válido
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
      <p className="text-xl">
        {t("dashboard.welcome", { name: profile.name })}
      </p>
      <p>{t("dashboard.email", { email: profile.email })}</p>
      <p>{t("dashboard.role", { role: profile.role })}</p>
      <button
        onClick={() => {
          logout();
          router.replace("/login");
        }}
        className="mt-4 px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300"
      >
        {t("common.logout")}
      </button>
    </main>
  );
}
