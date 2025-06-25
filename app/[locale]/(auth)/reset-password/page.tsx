// app/[locale]/reset-password/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";

export default function ResetPasswordPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      // Se não tiver token na URL, volta para recover
      router.replace(`/recover`);
    }
  }, [token, locale, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      showToast(t("resetPassword.errors.required"), "danger");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(t("resetPassword.errors.passwordMismatch"), "danger");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: {
          token,
          newPassword,
          locale,
        },
      });
      setSuccess(true);
      showToast(t("resetPassword.successMessage"), "success");
    } catch (err: unknown) {
      console.error("[ResetPasswordPage] erro:", err);
      let message = t("resetPassword.errorGeneric");

      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code;
        if (code === "INVALID_OR_EXPIRED_TOKEN") {
          message = t("resetPassword.errors.invalidOrExpiredToken");
        }
      }

      showToast(message, "danger");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {t("resetPassword.successTitle")}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t("resetPassword.successMessage")}</p>
        <Link href={`/login`}>
          <Button
            variant="primary"
            className="w-full"
            label={t("resetPassword.backToLogin")}
          ></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {t("resetPassword.title")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("resetPassword.newPasswordLabel")}
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showToggle={true}
          required
        />

        <Input
          label={t("resetPassword.confirmPasswordLabel")}
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showToggle={true}
          required
        />

        <Button
          type="submit"
          label={loading ? t("common.loading") : t("resetPassword.button")}
          variant="primary"
          disabled={loading}
          className="w-full"
        />
      </form>
    </div>
  );
}
