// components/Account/ProfileImagePlaceholder.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";

export default function ProfileImagePlaceholder() {
  const t = useTranslations("account.profileImage");

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg w-full max-w-xs">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
        {/* Ícone genérico de usuário */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804z"
          />
        </svg>
      </div>

      {/* Botão apenas como placeholder, desabilitado por enquanto */}
      <Button
        disabled
        className="mt-3 text-sm text-gray-500 cursor-not-allowed"
        label={t("changePhoto")}
      ></Button>
    </div>
  );
}
