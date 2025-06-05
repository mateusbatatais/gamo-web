// app/[locale]/(auth)/layout.tsx
"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import "../../globals.scss";
import { Link } from "@/i18n/navigation";
import { useClearInvalidToken } from "@/hooks/useClearInvalidToken";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  useClearInvalidToken();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-gray-900">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/images/logo-gamo.svg"
              className="h-24 w-auto"
              alt="Logo Gamo"
              width={150}
              height={50}
              priority={true}
            />
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
