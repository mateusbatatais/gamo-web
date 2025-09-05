// src/components/organisms/TradeGameForm/TradeGameForm.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import { Condition, MediaType } from "@/@types/collection.types";
import TradeFormBase, { TradeSubmitData } from "@/components/molecules/TradeFormBase/TradeFormBase";
import { Select, SelectOption } from "@/components/atoms/Select/Select";

interface TradeGameFormProps {
  gameId: number;
  platformOptions?: SelectOption[];
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
    platformId?: number;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const TradeGameForm = ({
  gameId,
  platformOptions = [],
  initialData,
  onSuccess,
  onCancel,
}: TradeGameFormProps) => {
  const [selectedPlatformId, setSelectedPlatformId] = useState<number>(
    initialData?.platformId || (platformOptions[0] ? Number(platformOptions[0].value) : 0),
  );
  const t = useTranslations("TradeForm");
  const { createUserGame, updateUserGame, isPending } = useUserGameMutation();

  const handleSubmit = async (data: TradeSubmitData<Condition>) => {
    const payload = {
      gameId,
      platformId: selectedPlatformId,
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
      extraFields={
        platformOptions.length > 0 && (
          <Select
            name="platformId"
            value={selectedPlatformId.toString()}
            onChange={(e) => setSelectedPlatformId(Number(e.target.value))}
            label={t("platform")}
            options={platformOptions}
          />
        )
      }
    />
  );
};
