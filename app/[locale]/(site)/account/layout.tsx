// components/templates/AccountLayout/AccountLayout.tsx
import React, { ReactNode } from "react";
import AccountSidebar from "@/components/organisms/Account/AccountSidebar/AccountSidebar";
import { useTranslations } from "next-intl";
import { AuthGuard } from "@/contexts/AuthGuard";
interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const t = useTranslations("account");

  return (
    <AuthGuard>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 lg:w-1/5">
            <AccountSidebar />
          </div>
          <div className="w-full md:w-3/4 lg:w-4/5">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {t("title")}
            </h1>
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
