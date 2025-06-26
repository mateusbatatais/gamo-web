// app/[locale]/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { Divider } from "@/components/atoms/Divider/Divider";
import { Link } from "@/i18n/navigation";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { FieldError } from "@/@types/forms";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

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

  const handleValueChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    // Validação básica
    const newErrors: Record<string, FieldError> = {};
    if (!values.email.trim()) {
      newErrors.email = { message: t("login.errors.emailRequired") };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = { message: t("login.errors.emailInvalid") };
    }

    if (!values.password) {
      newErrors.password = { message: t("login.errors.passwordRequired") };
    } else if (values.password.length < 6) {
      newErrors.password = { message: t("login.errors.passwordMinLength") };
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: { email: values.email, password: values.password },
      });

      login(data.token);
      showToast(t("login.success"), "success");
      router.push("/account");
    } catch (err: unknown) {
      let errorCode: string | undefined = undefined;
      if (typeof err === "object" && err !== null && "code" in err) {
        errorCode = (err as { code?: string }).code;
      }

      if (errorCode === "INVALID_CREDENTIALS") {
        newErrors.password = { message: t("login.errors.invalidCredentials") };
      } else if (errorCode === "USER_NOT_FOUND") {
        newErrors.email = { message: t("login.errors.userNotFound") };
      } else if (errorCode === "EMAIL_NOT_VERIFIED") {
        newErrors.general = { message: t("login.errors.emailNotVerified") };
      } else {
        newErrors.general = { message: t("login.errorGeneric") };
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
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
        loading={loading}
        errors={errors}
        values={values}
        onValueChange={handleValueChange}
        additionalContent={
          <>
            <Divider label={t("login.or")} />

            <div className="flex flex-col gap-2">
              <SocialLoginButton
                provider="google"
                onError={(error) => showToast(error.message, "danger")}
              />
              <SocialLoginButton
                provider="microsoft"
                onError={(error) => showToast(error.message, "danger")}
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
