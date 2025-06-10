// app/account/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import AccountDetailsForm from "@/components/organisms/Account/AccountDetailsForm/AccountDetailsForm";
import ChangePasswordForm from "@/components/organisms/Account/ChangePasswordForm/ChangePasswordForm";
import { Button } from "@/components/atoms/Button/Button";

export default function AccountPage() {
  const { user, initialized, logout } = useAuth();
  const t = useTranslations("account.page");
  const router = useRouter();

  // Enquanto não inicializar (checar token no localStorage), não renderiza nada
  if (!initialized) {
    return null;
  }

  if (initialized && !user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AccountDetailsForm />
        </div>
      </div>

      <div className="mt-12">
        <ChangePasswordForm />
      </div>
      <Button
        onClick={() => {
          logout();
          router.replace("/login");
        }}
        label={t("logout")}
      />
    </div>
  );
}
