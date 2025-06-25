// app/[locale]/(auth)/signup/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";

export default function SignupSuccessPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const emailParam = searchParams.get("email");
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!emailParam) {
      router.replace(`/signup`);
    }
  }, [emailParam, router]);

  useEffect(() => {
    if (timer > 0) {
      const handle = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(handle);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = async () => {
    if (!emailParam) return;
    setResendError(null);
    setResendLoading(true);

    try {
      await apiFetch("/auth/resend-verification", {
        method: "POST",
        body: { email: emailParam },
      });
      setResendSuccess(true);
      showToast(t("signup.success.resendSuccess"), "success");
    } catch (err: unknown) {
      console.error("[SignupSuccessPage] erro ao reenviar:", err);
      const errorMsg = t("signup.success.resendError");
      setResendError(errorMsg);
      showToast(errorMsg, "danger");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {t("signup.success.title")}
      </h1>

      {emailParam && (
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("signup.success.message", { email: emailParam })}
        </p>
      )}

      <div className="space-y-4">
        <Link href={`/login`}>
          <Button
            variant="primary"
            className="w-full"
            label={t("signup.success.loginButton")}
          ></Button>
        </Link>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {resendSuccess ? (
            <p className="text-green-600 dark:text-green-400">
              {t("signup.success.resendSuccess")}
            </p>
          ) : (
            <>
              <p>{t("signup.success.noEmail")}</p>

              {!canResend ? (
                <p className="mt-1 font-medium text-gray-700 dark:text-gray-200">
                  {t("signup.success.resendTimer", { seconds: timer })}
                </p>
              ) : (
                <Button
                  onClick={handleResend}
                  disabled={resendLoading}
                  variant="transparent"
                  className="text-primary hover:underline disabled:opacity-50"
                  label={resendLoading ? t("common.loading") : t("signup.success.resendButton")}
                ></Button>
              )}

              {resendError && <p className="text-red-600 dark:text-red-400 mt-2">{resendError}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
