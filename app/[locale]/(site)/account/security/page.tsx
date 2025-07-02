// app/account/details/page.tsx
"use client";

import React from "react";
import AccountLayout from "@/components/templates/AccountLayout/AccountLayout";
import { useTranslations } from "next-intl";
import ChangePasswordForm from "@/components/organisms/Account/ChangePasswordForm/ChangePasswordForm";

export default function AccountDetailsPage() {
  const t = useTranslations("account.changePasswordForm");

  return (
    <AccountLayout title={t("title")}>
      <ChangePasswordForm />
    </AccountLayout>
  );
}
