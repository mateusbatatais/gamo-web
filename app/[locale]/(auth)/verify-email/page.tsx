// app/[locale]/(auth)/verify-email/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button/Button";
import { Spinner } from "@/components/Spinner/Spinner";

export default function VerifyEmailPage() {
  const t = useTranslations("verifyEmail");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "noToken"
  >("loading");
  const [message, setMessage] = useState("");

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`
        );
        const data = await res.json();

        if (!res.ok) {
          // API retornou um code + message
          setStatus("error");
          setMessage(data.message || t("errorGeneric"));
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-gray-900">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Spinner className="h-8 w-8 text-primary" />
            <p className="text-gray-700 dark:text-gray-300 text-center">
              {t("loading")}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t("successTitle")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <Button
              onClick={() => router.push(`/${t("locale")}/auth/login`)}
              variant="primary"
              className="mt-4 w-full"
              label={t("goToLogin")}
            ></Button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-red-600">
              {t("errorTitle")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {message}
            </p>
            <Button
              onClick={() => router.push(`/${t("locale")}/auth/signup`)}
              variant="primary"
              className="mt-4 w-full"
              label={t("goToSignup")}
            ></Button>
          </div>
        )}

        {status === "noToken" && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-red-600">
              {t("errorTitle")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {message}
            </p>
            <Button
              onClick={() => router.push(`/${t("locale")}/auth/signup`)}
              variant="primary"
              className="mt-4 w-full"
              label={t("goToSignup")}
            ></Button>
          </div>
        )}
      </div>
    </div>
  );
}
