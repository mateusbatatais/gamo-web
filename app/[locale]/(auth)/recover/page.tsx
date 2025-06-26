// app/[locale]/recover/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { apiFetch } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";
import { FieldError } from "@/@types/forms";
import { SuccessCard } from "@/components/atoms/SuccessCard/SuccessCard";

export default function RecoverPage() {
  const t = useTranslations();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [values, setValues] = useState({ email: "" });

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
      newErrors.email = { message: t("recover.errors.required") };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = { message: t("recover.errors.emailInvalid") };
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/auth/recover", {
        method: "POST",
        body: { email: values.email },
      });

      setEmailSent(true);
      showToast(t("recover.successMessage", { email: values.email }), "success");
    } catch (err: unknown) {
      let errorCode: string | undefined = undefined;
      if (err && typeof err === "object" && "code" in err) {
        errorCode = (err as { code?: string }).code;
      }

      if (errorCode === "USER_NOT_FOUND") {
        newErrors.email = { message: t("recover.errors.notFound") };
      } else {
        newErrors.general = { message: t("recover.errorGeneric") };
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
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
          <Link href={`/login`} className="text-primary hover:underline">
            {t("recover.backToLogin")}
          </Link>
        </div>
      }
    />
  );
}
