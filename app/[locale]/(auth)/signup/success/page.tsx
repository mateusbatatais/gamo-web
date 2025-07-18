// app/[locale]/(auth)/signup/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";
import { SuccessCard } from "@/components/molecules/SuccessCard/SuccessCard";
import { useTimer } from "@/hooks/useTimer";

export default function SignupSuccessPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const emailParam = searchParams.get("email");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const [remainingTime, { reset: resetTimer }] = useTimer({
    initialTime: 30,
    onComplete: () => {},
    autoStart: true,
  });

  const canResend = remainingTime === 0;

  useEffect(() => {
    if (!emailParam) {
      router.replace(`/signup`);
    }
  }, [emailParam, router]);

  const handleResend = async () => {
    if (!emailParam || !canResend) return;

    setResendError(null);
    setResendLoading(true);

    try {
      await apiFetch("/auth/resend-verification", {
        method: "POST",
        body: { email: emailParam },
      });
      setResendSuccess(true);
      resetTimer();
      showToast(t("signup.success.resendSuccess"), "success");
    } catch (err: unknown) {
      console.error("[SignupSuccessPage] erro ao reenviar:", err);
      setResendError(t("signup.success.resendError"));
      showToast(t("signup.success.resendError"), "danger");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div data-testid="signup-success-page">
      <SuccessCard
        title={t("signup.success.title")}
        message={t("signup.success.message", { email: emailParam ?? "" })}
        buttonHref="/login"
        buttonLabel={t("signup.success.loginButton")}
        additionalContent={
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {resendSuccess ? (
              <p
                className="text-green-600 dark:text-green-400"
                data-testid="resend-success-message"
              >
                {t("signup.success.resendSuccess")}
              </p>
            ) : (
              <>
                <p>{t("signup.success.noEmail")}</p>
                {!canResend ? (
                  <p className="mt-1 font-medium text-gray-700 dark:text-gray-200">
                    {t("signup.success.resendTimer", { seconds: remainingTime })}
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-primary hover:underline disabled:opacity-50"
                    data-testid="resend-button"
                  >
                    {resendLoading ? t("common.loading") : t("signup.success.resendButton")}
                  </button>
                )}
                {resendError && (
                  <p className="text-red-600 dark:text-red-400 mt-2">{resendError}</p>
                )}
              </>
            )}
          </div>
        }
      />
    </div>
  );
}
