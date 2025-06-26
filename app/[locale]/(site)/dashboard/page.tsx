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

  useEffect(() => {
    if (!initialized || !token) return;
    apiFetch<UserProfile>("/user/profile", { token })
      .then((data) => setProfile(data))
      .catch(() => {
        logout();
        router.replace("/login");
      })
      .finally(() => setLoadingProfile(false));
  }, [token, logout, router, initialized]);

  if (!initialized) {
    return <div>{t("common.loading")}</div>;
  }

  if (!token) {
    router.replace("/login");
    return null;
  }

  if (loadingProfile) {
    return <div>{t("common.loading")}</div>;
  }

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

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
      <p className="text-xl">{t("dashboard.welcome", { name: profile.name })}</p>
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
