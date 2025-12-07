// app/[locale]/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { Link } from "@/i18n/navigation";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";

import { FieldError } from "@/@types/form.types";
import { useSignup } from "@/hooks/auth/useSignup";

export default function SignupPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { mutate: signup, isPending: loading } = useSignup();

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

  const handleSubmit = () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    signup(
      { ...values, locale },
      {
        onError: (error) => {
          const newErrors: Record<string, FieldError> = {};
          if (error.code === "EMAIL_ALREADY_EXISTS") {
            newErrors.email = { message: t("signup.errors.emailExists") };
          } else {
            newErrors.general = { message: t("signup.errorGeneric") };
          }
          setErrors(newErrors);
        },
      },
    );
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
              <span className="px-2 text-gray-500 text-sm dark:text-gray-400">{t("login.or")}</span>
              <hr className="flex-1 border-gray-300 dark:border-gray-700" />
            </div>
            <div className="flex flex-col gap-2">
              <SocialLoginButton provider="google" />
              <SocialLoginButton provider="microsoft" />
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
