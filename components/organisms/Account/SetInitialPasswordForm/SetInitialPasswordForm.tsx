"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/utils/api";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { useToast } from "@/contexts/ToastContext";
import { Card } from "@/components/atoms/Card/Card";

interface ApiError extends Error {
  code?: string;
}

export default function SetInitialPasswordForm() {
  const { token, logout, login } = useAuth();
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
      const response = await apiFetch<{
        user: unknown;
        token: string;
      }>("/user/profile/initial-password", {
        token,
        method: "PUT",
        body: { newPassword, confirmNewPassword },
      });

      const successMsg = t("passwordSet");
      showToast(successMsg, "success");

      // Atualizar o token no contexto
      login(response.token);

      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === "UNAUTHORIZED") {
        logout();
        return;
      }
      console.error(apiErr);
      const message = apiErr.message || t("setError");
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
            label={t("newPassword")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            error={errorMsg ?? undefined}
            className="w-full"
            data-testid="input-new-password"
          />
        </div>

        <div>
          <Input
            label={t("confirmNewPassword")}
            data-testid="input-confirm-password"
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
