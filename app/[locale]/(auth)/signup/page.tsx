// app/[locale]/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl"; // Adicionei useLocale
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { Link } from "@/i18n/navigation";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";
import { apiFetch } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";
import { FieldError } from "@/@types/forms";

export default function SignupPage() {
  const t = useTranslations();
  const router = useRouter();
  const { showToast } = useToast();
  const locale = useLocale(); // Obtém o locale atual
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

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

  const handleValueChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, FieldError> = {};
    if (!values.name.trim()) {
      newErrors.name = { message: t("signup.errors.nameRequired") };
    }
    if (!values.email.trim()) {
      newErrors.email = { message: t("signup.errors.emailRequired") };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = { message: t("signup.errors.emailInvalid") };
    }
    if (!values.password) {
      newErrors.password = { message: t("signup.errors.passwordRequired") };
    } else if (values.password.length < 6) {
      newErrors.password = { message: t("signup.errors.passwordMinLength") };
    }
    return newErrors;
  };

  const handleApiError = (err: unknown, newErrors: Record<string, FieldError>) => {
    let errorCode: string | undefined = undefined;
    if (typeof err === "object" && err !== null && "code" in err) {
      errorCode = (err as { code?: string }).code;
    }
    if (errorCode === "USER_CREATED_EMAIL_FAILED") {
      showToast(t("signup.emailSendError"), "warning");
      router.push(`/signup/success?email=${encodeURIComponent(values.email)}`);
    } else if (errorCode === "EMAIL_ALREADY_EXISTS") {
      newErrors.email = { message: t("signup.errors.emailExists") };
      setErrors(newErrors);
    } else {
      newErrors.general = { message: t("signup.errorGeneric") };
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    const newErrors = validateFields();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch<{ userId: string; code?: string }>("/auth/signup", {
        method: "POST",
        body: { ...values, locale },
      });

      if (response.code === "USER_CREATED_EMAIL_FAILED") {
        showToast(t("signup.emailSendError"), "warning");
      } else {
        showToast(t("signup.success.title"), "success");
      }

      router.push(`/signup/success?email=${encodeURIComponent(values.email)}`);
    } catch (err: unknown) {
      handleApiError(err, {});
    } finally {
      setLoading(false);
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
        loading={loading}
        errors={errors}
        values={values}
        onValueChange={handleValueChange}
        additionalContent={
          <>
            <div className="my-4 flex items-center">
              <hr className="flex-1 border-gray-300 dark:border-gray-700" />
              <span className="px-2 text-gray-500 text-sm dark:text-gray-400">
                {t("login.or")}{" "}
              </span>
              <hr className="flex-1 border-gray-300 dark:border-gray-700" />
            </div>
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
