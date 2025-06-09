// app/[locale]/(auth)/signup/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/utils/api";
import { GoogleLoginButton } from "@/components/molecules/GoogleLoginButton/GoogleLoginButton";

export default function SignupPage() {
  const t = useTranslations();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Chama a API (ela vai criar o usuário + disparar o e-mail)
      await apiFetch<{ userId: string }>("/auth/signup", {
        method: "POST",
        body: { name, email, password },
      });

      // Redireciona para a página de sucesso, passando o e-mail na querystring
      router.push(`/signup/success?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      console.error("[SignupPage] erro capturado:", err);
      if (typeof err === "object" && err !== null && "code" in err) {
        const key = String((err as { code: string }).code)
          .toLowerCase()
          .split("_")
          .map((word, i) => (i > 0 ? word[0].toUpperCase() + word.slice(1) : word))
          .join("");
        setError(t(`signup.errors.${key}`));
      } else if (typeof err === "object" && err !== null && "message" in err) {
        setError(String((err as { message: string }).message));
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t("signup.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("signup.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("signup.nameLabel")}
          type="text"
          placeholder={t("signup.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label={t("signup.emailLabel")}
          type="email"
          placeholder={t("signup.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label={t("signup.passwordLabel")}
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
          label={loading ? t("common.loading") : t("signup.button")}
          variant="primary"
          disabled={loading}
          className="w-full"
        />
      </form>

      <div className="my-4 flex items-center">
        <hr className="flex-1 border-gray-300 dark:border-gray-700" />
        <span className="px-2 text-gray-500 text-sm dark:text-gray-400">{t("login.or")}</span>
        <hr className="flex-1 border-gray-300 dark:border-gray-700" />
      </div>

      <GoogleLoginButton />

      <div className="mt-6 flex justify-between text-sm">
        <Link href={`/login`} className="text-primary hover:underline">
          {t("signup.haveAccount")}
        </Link>
      </div>
    </>
  );
}
