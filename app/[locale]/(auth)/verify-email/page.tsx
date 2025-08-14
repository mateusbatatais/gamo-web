// app/[locale]/(auth)/verify-email/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { useToast } from "@/contexts/ToastContext";
import { useMutation } from "@tanstack/react-query";

type VerificationStatus = "loading" | "success" | "error" | "expired" | "noToken";

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");

  const { mutate: verifyEmail } = useMutation({
    mutationFn: async (token: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`,
      );
      if (!res.ok) throw await res.json();
      return res.json();
    },
    onSuccess: () => {
      try {
        localStorage.removeItem("gamo_token");
      } catch {}
      setStatus("success");
      setMessage(t("successMessage"));
      showToast(t("successMessage"), "success");
    },
    onError: (error: { code?: string; message?: string }) => {
      if (error.code === "INVALID_OR_EXPIRED_TOKEN") {
        setStatus("expired");
        setMessage(t("expiredMessage"));
        showToast(t("expiredMessage"), "warning");
      } else {
        setStatus("error");
        setMessage(error.message || t("errorGeneric"));
        showToast(error.message || t("errorGeneric"), "danger");
      }
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("noToken");
      setMessage(t("noTokenProvided"));
      return;
    }
    verifyEmail(token);
  }, [searchParams, verifyEmail, t]);

  useEffect(() => {
    if (status === "success") {
      const timeout = setTimeout(() => router.push(`/login`), 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center rounded-lg p-6 bg-gray-100 dark:bg-gray-800 px-4">
      <div className="w-full max-w-md">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Spinner className="h-8 w-8 text-primary" />
            <p className="text-gray-700 dark:text-gray-300 text-center">{t("loading")}</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t("successTitle")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400" data-testid="verify-success-message">
              {message}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("redirectingLogin")}</p>
          </div>
        )}

        {(status === "expired" || status === "error" || status === "noToken") && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-red-600">
              {status === "expired" ? t("expiredTitle") : t("errorTitle")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>
            <Button
              onClick={() => router.push(`/signup`)}
              variant="primary"
              className="mt-4 w-full"
              label={t("goToSignup")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
