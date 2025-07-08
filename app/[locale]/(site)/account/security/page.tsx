// app/account/details/page.tsx
"use client";

import React from "react";
import AccountLayout from "@/components/templates/AccountLayout/AccountLayout";
import { useTranslations } from "next-intl";
import ChangePasswordForm from "@/components/organisms/Account/ChangePasswordForm/ChangePasswordForm";
import { useAuth } from "@/contexts/AuthContext";
import SetInitialPasswordForm from "@/components/organisms/Account/SetInitialPasswordForm/SetInitialPasswordForm";

export default function AccountDetailsPage() {
  const t = useTranslations("account.changePasswordForm");
  const { user } = useAuth();
  const hasPassword = user?.hasPassword ?? true;

  return (
    <AccountLayout title={t("title")}>
      {hasPassword ? <ChangePasswordForm /> : <SetInitialPasswordForm />}
    </AccountLayout>
  );
}
