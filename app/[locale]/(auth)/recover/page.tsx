// app/[locale]/recover/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/utils/api";

export default function RecoverPage() {
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação simples de e-mail
    if (!email.trim()) {
      setError(t("recover.errors.required"));
      return;
    }
    // Regex mínima de validação de e-mail (pode aprimorar se desejar)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("recover.errors.emailInvalid"));
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/auth/recover", {
        method: "POST",
        body: { email },
      });
      setEmailSent(true);
    } catch (err: unknown) {
      console.error("[RecoverPage] erro:", err);
      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code;
        if (code === "USER_NOT_FOUND") {
          setError(t("recover.errors.notFound"));
        } else {
          setError(t("recover.errorGeneric"));
        }
      } else {
        setError(t("recover.errorGeneric"));
      }
    } finally {
      setLoading(false);
    }
  };

  // Se o e-mail já foi enviado, exibe mensagem de sucesso
  if (emailSent) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {t("recover.successTitle")}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("recover.successMessage", { email })}
        </p>
        <Link href={`/login`}>
          <Button variant="primary" className="w-full" label={t("recover.backToLogin")}></Button>
        </Link>
      </div>
    );
  }

  // Caso contrário, exibe o formulário de recuperação
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {t("recover.title")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("recover.emailLabel")}
          type="email"
          placeholder={t("recover.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button
          type="submit"
          label={loading ? t("common.loading") : t("recover.button")}
          variant="primary"
          disabled={loading}
          className="w-full"
        />
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href={`/login`} className="text-primary hover:underline">
          {t("recover.backToLogin")}
        </Link>
      </div>
    </div>
  );
}
