"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/utils/api";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";

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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const t = useTranslations("account.changePasswordForm");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMsg(t("passwordsDoNotMatch"));
      return;
    }

    setLoading(true);

    try {
      const payload: ChangePasswordPayload = {
        currentPassword,
        newPassword,
        confirmNewPassword,
      };

      // PUT /user/password
      await apiFetch<unknown>("/user/password", {
        token,
        method: "PUT",
        body: payload,
      });

      setSuccessMsg(t("passwordChanged"));
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
      setErrorMsg(apiErr.message || t("changeError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg w-full space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">{t("title")}</h2>

      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
      {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

      <div>
        <label className="block mb-1 text-gray-700">{t("currentPassword")}</label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
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
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-2"
        label={loading ? t("changing") : t("changePassword")}
      ></Button>
    </form>
  );
}
