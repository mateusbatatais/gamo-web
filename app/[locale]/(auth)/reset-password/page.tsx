"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { FieldError } from "@/@types/forms";
import { SuccessCard } from "@/components/molecules/SuccessCard/SuccessCard";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

export default function ResetPasswordPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [values, setValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { mutate: resetPassword, isPending: loading, isSuccess } = useResetPassword();

  useEffect(() => {
    if (!token) {
      router.replace("/recover");
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

  const validateForm = () => {
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

    return newErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    resetPassword(
      { token, newPassword: values.newPassword, locale },
      {
        onError: (error) => {
          const newErrors: Record<string, FieldError> = {};
          if (error.code === "INVALID_OR_EXPIRED_TOKEN") {
            newErrors.general = { message: t("resetPassword.errors.invalidOrExpiredToken") };
          } else {
            newErrors.general = { message: t("resetPassword.errorGeneric") };
          }
          setErrors(newErrors);
        },
      },
    );
  };

  if (isSuccess) {
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
