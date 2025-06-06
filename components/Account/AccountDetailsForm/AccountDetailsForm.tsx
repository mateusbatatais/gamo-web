// components/Account/AccountDetailsForm/AccountDetailsForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import Toast, { ToastType } from "@/components/ui/Toast/Toast";

interface UserDetailsPayload {
  name: string;
  email: string;
  description: string;
}

interface ApiError extends Error {
  code?: string;
}

export default function AccountDetailsForm() {
  const { token, user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // **Estado para mensagem inline de erro no campo**
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // **Estado para exibir toast**
  const [toastData, setToastData] = useState<{ type: ToastType; message: string } | null>(null);

  const t = useTranslations("account.detailsForm");
  const router = useRouter();

  // Ao montar, busca os dados atuais do usuário (incluindo description)
  useEffect(() => {
    async function fetchUserDetails() {
      if (!token) return;

      try {
        const data = await apiFetch<{
          name: string;
          email: string;
          description?: string;
        }>("/user/profile", { token });

        setName(data.name);
        setEmail(data.email);
        setDescription(data.description ?? "");
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        if (apiErr.code === "UNAUTHORIZED") {
          logout();
          return;
        }
        console.error(apiErr);
        // Exibe o erro no toast e também no campo name (por exemplo)
        setErrorMsg(t("fetchError"));
        setToastData({ type: "danger", message: t("fetchError") });
      }
    }

    fetchUserDetails();
  }, [token, logout, t]);

  // Fecha o toast
  function handleCloseToast() {
    setToastData(null);
  }

  // Quando o usuário submete o formulário, faz PUT /user/profile
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Limpa mensagem de erro inline antes de enviar nova requisição
    setErrorMsg(null);

    const payload: UserDetailsPayload = {
      name,
      email,
      description,
    };

    try {
      await apiFetch<unknown>("/user/profile", {
        token,
        method: "PUT",
        body: payload,
      });
      // Ao atualizar com sucesso, mostra toast de sucesso
      setToastData({ type: "success", message: t("updateSuccess") });
      // Atualiza dados no contexto / recarrega a página
      router.refresh();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === "UNAUTHORIZED") {
        logout();
        return;
      }
      console.error(apiErr);
      // Se a API retornar uma mensagem específica, exibimos inline e em toast
      const message = apiErr.message || t("updateError");
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
          <label className="block mb-1 text-gray-700">{t("name")}</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={errorMsg ?? undefined}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">{t("email")}</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={errorMsg ?? undefined}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">{t("description")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded h-24"
            placeholder={t("descriptionPlaceholder")}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2"
          label={loading ? t("saving") : t("saveChanges")}
        />
      </form>
    </>
  );
}
