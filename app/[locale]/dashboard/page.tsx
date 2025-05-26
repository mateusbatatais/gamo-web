"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { token, initialized, user } = useAuth();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    // só faz algo quando já inicializamos o token
    if (initialized && !token) {
      router.replace(
        `/${locale}/login?from=${encodeURIComponent(`/${locale}/dashboard`)}`
      );
    }
  }, [initialized, token, locale, router]);

  // enquanto não inicializou, você pode renderizar um loading
  if (!initialized) {
    return <div>Carregando...</div>;
  }

  // se não tiver token, já mandamos pro login e não chegamos aqui
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">
        Bem-vindo, usuário #{user?.userId}!
      </h1>
    </main>
  );
}
