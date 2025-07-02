// app/account/details/page.tsx
"use client";

import React from "react";
import AccountLayout from "@/components/templates/AccountLayout/AccountLayout";
import AccountDetailsForm from "@/components/organisms/Account/AccountDetailsForm/AccountDetailsForm";
import { useTranslations } from "next-intl";

export default function AccountDetailsPage() {
  const t = useTranslations("account.detailsForm");

  return (
    <AccountLayout title={t("title")}>
      <AccountDetailsForm />
    </AccountLayout>
  );
}
