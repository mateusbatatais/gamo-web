"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";

interface UserDetailsPayload {
  name: string;
  email: string;
  description: string;
}

// Define um tipo para erros vindos do apiFetch,
// já que ele adiciona dinamicamente a propriedade "code"
interface ApiError extends Error {
  code?: string;
}

export default function AccountDetailsForm() {
  const { token, user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const t = useTranslations("account.detailsForm");
  const router = useRouter();

  // Ao montar, busca os dados atuais do usuário (incluindo description)
  useEffect(() => {
    async function fetchUserDetails() {
      if (!token) return;

      try {
        // GET /user/profile
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
        setErrorMsg(t("fetchError"));
      }
    }

    fetchUserDetails();
  }, [token, logout, t]);

  // Quando o usuário submete o formulário, faz PUT /user/profile
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload: UserDetailsPayload = {
      name,
      email,
      description,
    };

    try {
      // PUT /user/profile
      await apiFetch<unknown>("/user/profile", {
        token,
        method: "PUT",
        body: payload,
      });
      // Ao atualizar com sucesso, força recarregamento de dados
      router.refresh();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === "UNAUTHORIZED") {
        logout();
        return;
      }
      console.error(apiErr);
      setErrorMsg(apiErr.message || t("updateError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg w-full space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">{t("title")}</h2>

      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

      <div>
        <label className="block mb-1 text-gray-700">{t("name")}</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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
      ></Button>
    </form>
  );
}
