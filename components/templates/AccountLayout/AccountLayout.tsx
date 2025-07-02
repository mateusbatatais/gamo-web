// components/templates/AccountLayout/AccountLayout.tsx
import React, { ReactNode } from "react";
import AccountSidebar from "@/components/organisms/Account/AccountSidebar/AccountSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface AccountLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AccountLayout({ children, title }: AccountLayoutProps) {
  const { user, initialized } = useAuth();
  const t = useTranslations("account.layout");
  const router = useRouter();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (initialized && !user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 lg:w-1/5">
          <AccountSidebar />
        </div>
        <div className="w-full md:w-3/4 lg:w-4/5">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {title || t("title")}
          </h1>
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
