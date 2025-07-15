// app/account/details/page.tsx
"use client";

import React from "react";
import ChangePasswordForm from "@/components/organisms/Account/ChangePasswordForm/ChangePasswordForm";
import { useAuth } from "@/contexts/AuthContext";
import SetInitialPasswordForm from "@/components/organisms/Account/SetInitialPasswordForm/SetInitialPasswordForm";

export default function AccountDetailsPage() {
  const { user } = useAuth();
  const hasPassword = user?.hasPassword ?? true;
  return hasPassword ? <ChangePasswordForm /> : <SetInitialPasswordForm />;
}
