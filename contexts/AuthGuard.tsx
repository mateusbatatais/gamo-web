// components/AuthGuard.tsx
"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // ajuste o caminho se necessário
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.push(`/login`);
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return null;
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
}
