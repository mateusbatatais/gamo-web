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
  const [loading, setLoading] = useState(true);

  // só redireciona depois de inicializar
  useEffect(() => {
    if (initialized && !token) {
      router.replace(`/login`);
    }
  }, [initialized, token, router]);

  // busca o perfil
  useEffect(() => {
    if (!token) return;
    apiFetch<UserProfile>("/user/profile", { token })
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, [token]);

  if (!initialized || loading) {
    return <div>{t("common.loading")}</div>;
  }

  if (!profile) {
    return (
      <div>
        {t("common.error")}{" "}
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300"
        >
          {t("common.logout")}
        </button>
      </div>
    );
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
      <p className="text-xl">
        {t("dashboard.welcome", { name: profile.name })}
      </p>
      <p>{t("dashboard.email", { email: profile.email })}</p>
      <p>{t("dashboard.role", { role: profile.role })}</p>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300"
      >
        {t("common.logout")}
      </button>
    </main>
  );
}
