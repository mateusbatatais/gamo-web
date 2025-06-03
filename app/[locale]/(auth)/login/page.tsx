// app/[locale]/(auth)/login/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { GoogleLoginButton } from "@/components/GoogleLoginButton/GoogleLoginButton";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Limpa qualquer token inválido ao montar a página
  useEffect(() => {
    try {
      localStorage.removeItem("gamo_token");
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Atualiza o contexto imediatamente com o token
      login(data.token);

      // Só depois redireciona para o dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      // Se vier código (INVALID_CREDENTIALS, etc.), traduzir
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof (err as { code: unknown }).code === "string"
      ) {
        const key = (err as { code: string }).code
          .toLowerCase()
          .split("_")
          .map((word, i) =>
            i > 0 ? word[0].toUpperCase() + word.slice(1) : word
          )
          .join("");
        const translated = t(`login.errors.${key}`);
        setError(translated);
      }
      // Se vier apenas mensagem
      else if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
      ) {
        setError((err as { message: string }).message);
      } else {
        setError(t("common.error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t("login.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("login.emailLabel")}
          type="email"
          placeholder={t("login.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label={t("login.passwordLabel")}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle={true}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button
          type="submit"
          label={loading ? t("common.loading") : t("login.button")}
          variant="primary"
          disabled={loading}
          className="w-full"
        />
      </form>

      <div className="my-4 flex items-center">
        <hr className="flex-1 border-gray-300 dark:border-gray-700" />
        <span className="px-2 text-gray-500 text-sm dark:text-gray-400">
          {t("login.or")}
        </span>
        <hr className="flex-1 border-gray-300 dark:border-gray-700" />
      </div>

      <GoogleLoginButton />

      <div className="mt-6 flex justify-between text-sm">
        <Link href="/recover" className="text-primary hover:underline">
          {t("login.forgot")}
        </Link>
        <Link href="/signup" className="text-primary hover:underline">
          {t("login.noAccount")}
        </Link>
      </div>
    </>
  );
}
