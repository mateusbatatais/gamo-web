// app/[locale]/(auth)/signup/success/page.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/contexts/ToastContext";
import { SuccessCard } from "@/components/molecules/SuccessCard/SuccessCard";
import { useTimer } from "@/hooks/useTimer";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/api-client";

export default function SignupSuccessPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { apiFetch } = useApiClient();
  const emailParam = searchParams.get("email");

  const [remainingTime, { reset: resetTimer }] = useTimer({
    initialTime: 30,
    onComplete: () => {},
    autoStart: true,
  });

  const canResend = remainingTime === 0;

  const {
    mutate: resendVerification,
    isPending: resendLoading,
    isSuccess: resendSuccess,
  } = useMutation({
    mutationFn: async (email: string) => {
      return apiFetch("/auth/resend-verification", {
        method: "POST",
        body: { email },
      });
    },
    onSuccess: () => {
      resetTimer();
      showToast(t("signup.success.resendSuccess"), "success");
    },
    onError: () => {
      showToast(t("signup.success.resendError"), "danger");
    },
  });

  const handleResend = () => {
    if (!emailParam || !canResend) return;
    resendVerification(emailParam);
  };

  if (!emailParam) {
    router.replace(`/signup`);
    return null;
  }

  return (
    <div data-testid="signup-success-page">
      <SuccessCard
        title={t("signup.success.title")}
        message={t("signup.success.message", { email: emailParam })}
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
              </>
            )}
          </div>
        }
      />
    </div>
  );
}
