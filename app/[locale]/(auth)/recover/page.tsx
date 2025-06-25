// app/[locale]/recover/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { apiFetch } from "@/utils/api";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

export default function RecoverPage() {
  const t = useTranslations();
  const { showToast } = useToast(); // Usando o hook do Toast
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast(t("recover.errors.required"), "danger");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast(t("recover.errors.emailInvalid"), "danger");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/auth/recover", {
        method: "POST",
        body: { email },
      });
      setEmailSent(true);
      showToast(t("recover.successMessage", { email }), "success");
    } catch (err: unknown) {
      console.error("[RecoverPage] erro:", err);
      let message = t("recover.errorGeneric");

      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code;
        if (code === "USER_NOT_FOUND") {
          message = t("recover.errors.notFound");
        }
      }

      showToast(message, "danger");
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
