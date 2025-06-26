// app/[locale]/(auth)/signup/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { apiFetch } from "@/utils/api";
import { Divider } from "@/components/atoms/Divider/Divider";
import { Link } from "@/i18n/navigation";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";
import { useToast } from "@/contexts/ToastContext";
import { AuthError, translateAuthError } from "@/utils/authErrors";

export default function SignupPage() {
  const t = useTranslations();
  const router = useRouter();
  const { showToast } = useToast();

  const signupConfig = {
    fields: [
      {
        name: "name",
        label: t("signup.nameLabel"),
        type: "text",
        placeholder: t("signup.namePlaceholder"),
        required: true,
      },
      {
        name: "email",
        label: t("signup.emailLabel"),
        type: "email",
        placeholder: t("signup.emailPlaceholder"),
        required: true,
      },
      {
        name: "password",
        label: t("signup.passwordLabel"),
        type: "password",
        placeholder: "••••••••",
        required: true,
        showToggle: true,
      },
    ],
    submitLabel: t("signup.button"),
  };

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      await apiFetch<{ userId: string }>("/auth/signup", {
        method: "POST",
        body: values,
      });

      router.push(`/signup/success?email=${encodeURIComponent(values.email)}`);
    } catch (err: unknown) {
      const message = translateAuthError(err as AuthError, t.raw);

      // Erro específico de e-mail
      if ((err as AuthError).code === "EMAIL_SEND_FAILED") {
        showToast(t("signup.emailSendError"), "warning");
        router.push(`/signup/success?email=${encodeURIComponent(values.email)}`);
      } else {
        showToast(message, "danger");
      }
    }
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t("signup.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("signup.subtitle")}</p>
      </div>

      <AuthForm
        config={signupConfig}
        onSubmit={handleSubmit}
        additionalContent={
          <>
            <Divider label={t("login.or")} />

            <div className="flex flex-col gap-2">
              <SocialLoginButton
                provider="google"
                onError={(error) => console.log(error.message)}
              />
              <SocialLoginButton
                provider="microsoft"
                onError={(error) => console.log(error.message)}
              />
            </div>
            <div className="mt-6 flex justify-between text-sm">
              <Link href={`/login`} className="text-primary hover:underline">
                {t("signup.haveAccount")}
              </Link>
            </div>
          </>
        }
      />
    </>
  );
}
