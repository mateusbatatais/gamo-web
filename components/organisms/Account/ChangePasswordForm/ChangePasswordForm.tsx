// components/Account/ChangePasswordForm/ChangePasswordForm.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { useToast } from "@/contexts/ToastContext";
import { Card } from "@/components/atoms/Card/Card";
import { useAccount } from "@/hooks/account/useUserAccount";

export default function ChangePasswordForm() {
  const { changePasswordMutation } = useAccount();
  const { showToast } = useToast();
  const t = useTranslations("account.changePasswordForm");

  const [currentPassword, setCurrentPassword] = useState("");
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

    changePasswordMutation.mutate(
      { currentPassword, newPassword, confirmNewPassword },
      {
        onSuccess: () => {
          showToast(t("passwordChanged"), "success");
          // Resetar os campos após sucesso
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        },
        onError: (error) => {
          const message = error.message || t("changeError");
          setFormError(message);
          showToast(message, "danger");
        },
      },
    );
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          data-testid="input-current-password"
          label={t("currentPassword")}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          error={formError ?? undefined}
          className="w-full"
        />

        <Input
          data-testid="input-new-password"
          label={t("newPassword")}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          error={formError ?? undefined}
          className="w-full"
        />

        <Input
          data-testid="input-confirm-password"
          label={t("confirmNewPassword")}
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          error={formError ?? undefined}
          className="w-full"
        />

        <Button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="mt-2"
          label={changePasswordMutation.isPending ? t("changing") : t("changePassword")}
          data-testid="button-change-password"
        />
      </form>
    </Card>
  );
}
