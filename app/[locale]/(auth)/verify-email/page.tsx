// app/[locale]/(auth)/verify-email/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Spinner } from "@/components/atoms/Spinner/Spinner";

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired" | "noToken">(
    "loading",
  );
  const [message, setMessage] = useState("");

  // Assim que carregue, limpa token inválido em localStorage
  useEffect(() => {
    try {
      localStorage.removeItem("gamo_token");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function verify() {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("noToken");
        setMessage(t("noTokenProvided"));
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`,
        );
        const data = await res.json();

        if (!res.ok) {
          if (data.code === "INVALID_OR_EXPIRED_TOKEN") {
            setStatus("expired");
            setMessage(t("expiredMessage"));
          } else {
            setStatus("error");
            setMessage(data.message || t("errorGeneric"));
          }
        } else {
          setStatus("success");
          setMessage(t("successMessage"));
        }
      } catch {
        setStatus("error");
        setMessage(t("errorGeneric"));
      }
    }

    verify();
  }, [searchParams, t]);

  // Redireciona para login 2s após sucesso
  useEffect(() => {
    if (status === "success") {
      // Garante que não haja token armazenado
      try {
        localStorage.removeItem("gamo_token");
      } catch {}

      const timeout = setTimeout(() => {
        router.push(`/login`); // sem locale explícito → Next-Intl encaixa pt/en
      }, 2000);
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
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("redirectingLogin")}</p>
          </div>
        )}

        {(status === "expired" || status === "error") && (
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

        {status === "noToken" && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-red-600">{t("errorTitle")}</h1>
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
