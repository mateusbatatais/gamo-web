// components/Account/ChangePasswordForm/ChangePasswordForm.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/utils/api";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { useToast } from "@/contexts/ToastContext"; // Novo hook importado
import { Card } from "@/components/atoms/Card/Card";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ApiError extends Error {
  code?: string;
}

export default function ChangePasswordForm() {
  const { token, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = useTranslations("account.changePasswordForm");
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmNewPassword) {
      const msg = t("passwordsDoNotMatch");
      setErrorMsg(msg);
      showToast(msg, "warning");
      return;
    }

    setLoading(true);

    try {
      const payload: ChangePasswordPayload = {
        currentPassword,
        newPassword,
        confirmNewPassword,
      };

      await apiFetch<unknown>("/user/profile/password", {
        token,
        method: "PUT",
        body: payload,
      });

      const successMsg = t("passwordChanged");
      showToast(successMsg, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === "UNAUTHORIZED") {
        logout();
        return;
      }
      console.error(apiErr);
      const message = apiErr.message || t("changeError");
      setErrorMsg(message);
      showToast(message, "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            data-testid="input-current-password"
            label={t("currentPassword")}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            error={errorMsg ?? undefined}
            className="w-full"
          />
        </div>

        <div>
          <Input
            data-testid="input-new-password"
            label={t("newPassword")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            error={errorMsg ?? undefined}
            className="w-full"
          />
        </div>

        <div>
          <Input
            data-testid="input-confirm-password"
            label={t("confirmNewPassword")}
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            error={errorMsg ?? undefined}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2"
          label={loading ? t("changing") : t("changePassword")}
          data-testid="button-change-password"
        />
      </form>
    </Card>
  );
}
