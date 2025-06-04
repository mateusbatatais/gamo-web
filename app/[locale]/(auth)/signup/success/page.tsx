// app/[locale]/(auth)/signup/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button/Button";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/utils/api";

export default function SignupSuccessPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Recupera o e-mail que veio na query string (?email=xxx@yyy)
  const emailParam = searchParams.get("email");

  // Timer inicial (em segundos) para aguardar antes de habilitar o botão de reenvio
  const [timer, setTimer] = useState<number>(30);
  // flag que indica se já pode reenviar (quando timer chega a 0)
  const [canResend, setCanResend] = useState<boolean>(false);

  // Estados para lidar com o clique “Reenviar e-mail”
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Se não houver e-mail na query, redireciona de volta ao signup
  useEffect(() => {
    if (!emailParam) {
      router.replace(`/signup`);
    }
  }, [emailParam, router]);

  // Contagem regressiva: decrementa 'timer' a cada segundo até chegar em zero
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

  // Função que dispara a chamada ao endpoint de reenvio
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
    } catch (err: unknown) {
      console.error("[SignupSuccessPage] erro ao reenviar:", err);
      setResendError(t("signup.success.resendError"));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      {/* Título */}
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {t("signup.success.title")}
      </h1>

      {/* Mensagem principal, exibida sempre */}
      {emailParam && (
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("signup.success.message", { email: emailParam })}
        </p>
      )}

      <div className="space-y-4">
        {/* Botão “Ir para Login” */}
        <Link href={`/login`}>
          <Button
            variant="primary"
            className="w-full"
            label={t("signup.success.loginButton")}
          ></Button>
        </Link>

        {/* Seção de reenvio de e-mail */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {resendSuccess ? (
            // Se já reenviou com sucesso, mostra mensagem de sucesso
            <p className="text-green-600 dark:text-green-400">
              {t("signup.success.resendSuccess")}
            </p>
          ) : (
            <>
              {/* Texto “Não recebeu o e-mail?” */}
              <p>{t("signup.success.noEmail")}</p>

              {/* Se ainda não pode reenviar (timer > 0), mostra contagem */}
              {!canResend ? (
                <p className="mt-1 font-medium text-gray-700 dark:text-gray-200">
                  {t("signup.success.resendTimer", { seconds: timer })}
                </p>
              ) : (
                // Caso timer === 0, exibe o botão habilitado (ou em loading)
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-primary hover:underline disabled:opacity-50"
                >
                  {resendLoading
                    ? t("common.loading")
                    : t("signup.success.resendButton")}
                </button>
              )}

              {/* Se der erro ao reenviar, exibe mensagem de erro */}
              {resendError && (
                <p className="text-red-600 dark:text-red-400 mt-2">
                  {resendError}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
