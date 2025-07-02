// app/account/page.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import AccountLayout from "@/components/templates/AccountLayout/AccountLayout";
import AccountOverview from "@/components/organisms/Account/AccountOverview/AccountOverview";

export default function AccountPage() {
  const t = useTranslations("account.overview");

  return (
    <AccountLayout title={t("title")}>
      <AccountOverview />
    </AccountLayout>
  );
}
