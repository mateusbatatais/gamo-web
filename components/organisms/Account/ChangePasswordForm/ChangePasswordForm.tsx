// components/Account/ChangePasswordForm/ChangePasswordForm.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/utils/api";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import Toast, { ToastType } from "@/components/molecules/Toast/Toast";

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

  // **Estado para mensagem inline de erro no campo**
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // **Estado para exibir toast**
  const [toastData, setToastData] = useState<{ type: ToastType; message: string } | null>(null);

  const t = useTranslations("account.changePasswordForm");

  function handleCloseToast() {
    setToastData(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Limpa mensagens anteriores
    setErrorMsg(null);
    setToastData(null);

    if (newPassword !== confirmNewPassword) {
      const msg = t("passwordsDoNotMatch");
      setErrorMsg(msg);
      setToastData({ type: "warning", message: msg });
      return;
    }

    setLoading(true);

    try {
      const payload: ChangePasswordPayload = {
        currentPassword,
        newPassword,
        confirmNewPassword,
      };

      // PUT /user/profile/password
      await apiFetch<unknown>("/user/profile/password", {
        token,
        method: "PUT",
        body: payload,
      });

      const successMsg = t("passwordChanged");
      setToastData({ type: "success", message: successMsg });
      // Limpa campos
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
      setToastData({ type: "danger", message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {toastData && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center">
          <Toast
            type={toastData.type}
            message={toastData.message}
            durationMs={5000}
            onClose={handleCloseToast}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg w-full space-y-4 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold">{t("title")}</h2>

        <div>
          <label className="block mb-1 text-gray-700">{t("currentPassword")}</label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            error={errorMsg ?? undefined}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">{t("newPassword")}</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            error={errorMsg ?? undefined}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">{t("confirmNewPassword")}</label>
          <Input
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
        />
      </form>
    </>
  );
}
