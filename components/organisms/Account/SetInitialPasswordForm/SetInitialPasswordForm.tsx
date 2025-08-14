// components/Account/SetInitialPasswordForm/SetInitialPasswordForm.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { useToast } from "@/contexts/ToastContext";
import { Card } from "@/components/atoms/Card/Card";
import { useAccount } from "@/hooks/account/useUserAccount";

export default function SetInitialPasswordForm() {
  const { setInitialPasswordMutation } = useAccount();
  const { showToast } = useToast();
  const t = useTranslations("account.changePasswordForm");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validação do formulário
    if (newPassword !== confirmNewPassword) {
      const msg = t("passwordsDoNotMatch");
      setFormError(msg);
      showToast(msg, "warning");
      return;
    }

    setInitialPasswordMutation.mutate(
      { newPassword, confirmNewPassword },
      {
        onSuccess: () => {
          showToast(t("passwordSet"), "success");
          // Resetar os campos após sucesso
          setNewPassword("");
          setConfirmNewPassword("");
        },
        onError: () => {
          setFormError(t("setError"));
          showToast(t("setError"), "danger");
        },
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("newPassword")}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          error={formError || undefined}
          className="w-full"
          data-testid="input-new-password"
        />

        <Input
          label={t("confirmNewPassword")}
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          error={formError || undefined}
          className="w-full"
          data-testid="input-confirm-password"
        />

        <Button
          type="submit"
          disabled={setInitialPasswordMutation.isPending}
          className="mt-2"
          label={setInitialPasswordMutation.isPending ? t("changing") : t("changePassword")}
          data-testid="button-change-password"
        />
      </form>
    </Card>
  );
}
