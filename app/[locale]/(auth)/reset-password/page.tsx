// app/[locale]/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { apiFetch } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";
import { FieldError } from "@/@types/forms";
import { SuccessCard } from "@/components/molecules/SuccessCard/SuccessCard";

export default function ResetPasswordPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const token = searchParams.get("token") || "";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [values, setValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      router.replace(`/recover`);
    }
  }, [token, router]);

  const resetPasswordConfig = {
    fields: [
      {
        name: "newPassword",
        label: t("resetPassword.newPasswordLabel"),
        type: "password",
        placeholder: "••••••••",
        required: true,
        showToggle: true,
      },
      {
        name: "confirmPassword",
        label: t("resetPassword.confirmPasswordLabel"),
        type: "password",
        placeholder: "••••••••",
        required: true,
        showToggle: true,
      },
    ],
    submitLabel: t("resetPassword.button"),
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
    if (!values.newPassword) {
      newErrors.newPassword = { message: t("resetPassword.errors.required") };
    } else if (values.newPassword.length < 6) {
      newErrors.newPassword = { message: t("resetPassword.errors.passwordMinLength") };
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = { message: t("resetPassword.errors.required") };
    } else if (values.newPassword !== values.confirmPassword) {
      newErrors.confirmPassword = { message: t("resetPassword.errors.passwordMismatch") };
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: {
          token,
          newPassword: values.newPassword,
          locale,
        },
      });

      setSuccess(true);
      showToast(t("resetPassword.successMessage"), "success");
    } catch (err: unknown) {
      let errorCode: string | undefined = undefined;
      if (err && typeof err === "object" && "code" in err) {
        errorCode = (err as { code?: string }).code;
      }

      if (errorCode === "INVALID_OR_EXPIRED_TOKEN") {
        newErrors.general = { message: t("resetPassword.errors.invalidOrExpiredToken") };
      } else {
        newErrors.general = { message: t("resetPassword.errorGeneric") };
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessCard
        title={t("resetPassword.successTitle")}
        message={t("resetPassword.successMessage")}
        buttonHref="/login"
        buttonLabel={t("resetPassword.backToLogin")}
      />
    );
  }

  return (
    <AuthForm
      config={resetPasswordConfig}
      onSubmit={handleSubmit}
      loading={loading}
      errors={errors}
      values={values}
      onValueChange={handleValueChange}
    />
  );
}
