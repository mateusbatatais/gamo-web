// app/[locale]/(auth)/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Divider } from "@/components/atoms/Divider/Divider";
import { Link } from "@/i18n/navigation";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuth();

  const loginConfig = {
    fields: [
      {
        name: "email",
        label: t("login.emailLabel"),
        type: "email",
        placeholder: t("login.emailPlaceholder"),
        required: true,
      },
      {
        name: "password",
        label: t("login.passwordLabel"),
        type: "password",
        placeholder: "••••••••",
        required: true,
        showToggle: true,
      },
    ],
    submitLabel: t("login.button"),
  };

  const handleSubmit = async (values: Record<string, string>) => {
    const data = await apiFetch<{ token: string }>("/auth/login", {
      method: "POST",
      body: { email: values.email, password: values.password },
    });

    login(data.token);
    router.push("/account");
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t("login.title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("login.subtitle")}</p>
      </div>

      <AuthForm
        config={loginConfig}
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
              <Link href="/reset-password" className="text-primary hover:underline">
                {t("login.forgot")}
              </Link>
              <Link href="/signup" className="text-primary hover:underline">
                {t("login.noAccount")}
              </Link>
            </div>
          </>
        }
      />
    </>
  );
}
