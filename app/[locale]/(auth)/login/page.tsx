"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AuthForm } from "@/components/organisms/AuthForm/AuthForm";
import { Link } from "@/i18n/navigation";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton/SocialLoginButton";
import { useToast } from "@/contexts/ToastContext";
import { FieldError } from "@/@types/forms";
import { useLogin } from "@/hooks/auth/useLogin";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/account";

  const t = useTranslations();
  const router = useRouter();
  const { showToast } = useToast();
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const { mutate: login, isPending: loading } = useLogin();

  useEffect(() => {
    const handlePendingAction = (event: CustomEvent) => {
      const action = event.detail;
      if (action.type === "ADD_TO_COLLECTION") {
        console.log("Retomando ação:", action.payload);
      }
    };

    window.addEventListener("pendingActionExecuted", handlePendingAction as EventListener);

    return () => {
      window.removeEventListener("pendingActionExecuted", handlePendingAction as EventListener);
    };
  }, []);

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

    return newErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    login(values, {
      onSuccess: () => {
        showToast(t("login.success"), "success");
        router.push(returnUrl);
      },
      onError: (error) => {
        const newErrors: Record<string, FieldError> = {};

        // Tratamento seguro do erro
        if (error.errors) {
          // Se houver erros de campo específicos da API
          setErrors(error.errors);
        } else if (error.code) {
          // Erros globais da API
          switch (error.code) {
            case "INVALID_CREDENTIALS":
              newErrors.password = { message: t("login.errors.invalidCredentials") };
              break;
            case "USER_NOT_FOUND":
              newErrors.email = { message: t("login.errors.userNotFound") };
              break;
            case "EMAIL_NOT_VERIFIED":
              newErrors.general = { message: t("login.errors.emailNotVerified") };
              break;
            default:
              newErrors.general = { message: error.message || t("login.errorGeneric") };
          }
        } else {
          newErrors.general = { message: t("login.errorGeneric") };
        }

        setErrors(newErrors);
      },
    });
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
            <div className="my-4 flex items-center">
              <hr className="flex-1 border-gray-300 dark:border-gray-700" />
              <span className="px-2 text-gray-500 text-sm dark:text-gray-400">{t("login.or")}</span>
              <hr className="flex-1 border-gray-300 dark:border-gray-700" />
            </div>

            <div className="flex flex-col gap-2">
              <SocialLoginButton
                provider="google"
                onError={(error) => showToast(error.message, "danger")}
                returnUrl={returnUrl}
              />
              <SocialLoginButton
                provider="microsoft"
                onError={(error) => showToast(error.message, "danger")}
                returnUrl={returnUrl}
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
