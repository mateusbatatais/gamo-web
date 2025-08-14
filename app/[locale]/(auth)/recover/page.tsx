"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import Link from "next/link";
import { FieldError } from "@/@types/forms";
import { SuccessCard } from "@/components/molecules/SuccessCard/SuccessCard";
import { useRecoverPassword } from "@/hooks/auth/useRecoverPassword";

export default function RecoverPage() {
  const t = useTranslations();
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [values, setValues] = useState({ email: "" });

  const {
    mutate: recoverPassword,
    isPending: loading,
    isSuccess: emailSent,
  } = useRecoverPassword();

  const recoverConfig = {
    fields: [
      {
        name: "email",
        label: t("recover.emailLabel"),
        type: "email",
        placeholder: t("recover.emailPlaceholder"),
        required: true,
      },
    ],
    submitLabel: t("recover.button"),
  };

  const handleValueChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, FieldError> = {};

    if (!values.email.trim()) {
      newErrors.email = { message: t("recover.errors.required") };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = { message: t("recover.errors.emailInvalid") };
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    recoverPassword(
      { email: values.email },
      {
        onError: (error) => {
          const newErrors: Record<string, FieldError> = {};
          if (error.code === "USER_NOT_FOUND") {
            newErrors.email = { message: t("recover.errors.notFound") };
          } else {
            newErrors.general = { message: t("recover.errorGeneric") };
          }
          setErrors(newErrors);
        },
      },
    );
  };

  if (emailSent) {
    return (
      <SuccessCard
        title={t("recover.successTitle")}
        message={t("recover.successMessage", { email: values.email })}
        buttonHref="/login"
        buttonLabel={t("recover.backToLogin")}
      />
    );
  }

  return (
    <AuthForm
      config={recoverConfig}
      onSubmit={handleSubmit}
      loading={loading}
      errors={errors}
      values={values}
      onValueChange={handleValueChange}
      additionalContent={
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            {t("recover.backToLogin")}
          </Link>
        </div>
      }
    />
  );
}
