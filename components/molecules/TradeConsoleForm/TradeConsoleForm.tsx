// src/components/organisms/TradeConsoleForm/TradeConsoleForm.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useUserConsoleMutation } from "@/hooks/useUserConsoleMutation";
import TradeFormBase, { TradeSubmitData } from "@/components/molecules/TradeFormBase/TradeFormBase";

interface TradeConsoleFormProps {
  consoleId: number;
  consoleVariantId: number;
  skinId?: number | null;
  initialData?: {
    id?: number;
    description?: string | null;
    status?: "SELLING" | "LOOKING_FOR";
    price?: number | null;
    hasBox?: boolean | null;
    hasManual?: boolean | null;
    condition?: "NEW" | "USED" | "REFURBISHED" | null;
    acceptsTrade?: boolean | null;
    photoMain?: string | null;
    photos?: string[] | null;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const TradeConsoleForm = ({
  consoleId,
  consoleVariantId,
  skinId,
  initialData,
  onSuccess,
  onCancel,
}: TradeConsoleFormProps) => {
  const t = useTranslations("ConsoleForm");
  const { createUserConsole, updateUserConsole, isPending } = useUserConsoleMutation();

  const handleSubmit = async (data: TradeSubmitData<"NEW" | "USED" | "REFURBISHED">) => {
    const payload = {
      consoleId,
      consoleVariantId,
      skinId: skinId || undefined,
      ...data,
    };

    if (initialData?.id) {
      await updateUserConsole({ id: initialData.id, data: payload });
    } else {
      await createUserConsole(payload);
    }
  };

  const conditionOptions: { value: "NEW" | "USED" | "REFURBISHED"; label: string }[] = [
    { value: "NEW", label: t("conditionNew") },
    { value: "USED", label: t("conditionUsed") },
    { value: "REFURBISHED", label: t("conditionRefurbished") },
  ];

  return (
    <TradeFormBase<"NEW" | "USED" | "REFURBISHED">
      t={t}
      initialData={initialData}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      isSubmitting={isPending}
      conditionOptions={conditionOptions}
    />
  );
};
