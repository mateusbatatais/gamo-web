// components/AuthGuard.tsx
"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // ajuste o caminho se necessário
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.replace(`/${locale}/login`);
    }
  }, [initialized, user, router, locale]);

  if (!initialized) {
    return null;
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
}
