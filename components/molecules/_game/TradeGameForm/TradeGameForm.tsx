// src/components/organisms/TradeGameForm/TradeGameForm.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import { Condition, MediaType } from "@/@types/collection.types";
import TradeFormBase, { TradeSubmitData } from "@/components/molecules/TradeFormBase/TradeFormBase";

interface TradeGameFormProps {
  gameId: number;
  initialData?: {
    id?: number;
    description?: string | null;
    media?: MediaType;
    status?: "SELLING" | "LOOKING_FOR";
    price?: number | null;
    hasBox?: boolean | null;
    hasManual?: boolean | null;
    condition?: Condition | null;
    acceptsTrade?: boolean | null;
    photoMain?: string | null;
    photos?: string[] | null;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const TradeGameForm = ({ gameId, initialData, onSuccess, onCancel }: TradeGameFormProps) => {
  const t = useTranslations("GameForm");
  const { createUserGame, updateUserGame, isPending } = useUserGameMutation();

  const handleSubmit = async (data: TradeSubmitData<Condition>) => {
    const payload = {
      gameId,
      media: (initialData?.media || "PHYSICAL") as MediaType,
      ...data,
    };

    if (initialData?.id) {
      await updateUserGame({ id: initialData.id, data: payload });
    } else {
      await createUserGame(payload);
    }
  };

  const conditionOptions = [
    { value: "NEW" as Condition, label: t("conditionNew") },
    { value: "USED" as Condition, label: t("conditionUsed") },
    { value: "REFURBISHED" as Condition, label: t("conditionRefurbished") },
  ];

  return (
    <TradeFormBase<Condition>
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
