// components/molecules/TradeAccessoryForm/TradeAccessoryForm.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import TradeFormBase, {
  TradeSubmitData,
  StatusType,
} from "@/components/molecules/TradeFormBase/TradeFormBase";
import { Condition } from "@/@types/collection.types";

interface TradeAccessoryFormProps {
  accessoryId: number;
  accessoryVariantId: number;
  variantSlug: string;
  initialData?: {
    id?: number;
    description?: string | null;
    status?: StatusType;
    price?: number | null;
    hasBox?: boolean | null;
    hasManual?: boolean | null;
    condition?: Condition;
    acceptsTrade?: boolean | null;
    photoMain?: string | null;
    photos?: string[] | null;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const TradeAccessoryForm = ({
  accessoryId,
  accessoryVariantId,
  variantSlug,
  initialData,
  onSuccess,
  onCancel,
}: TradeAccessoryFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserAccessory, updateUserAccessory, isPending } = useUserAccessoryMutation();

  const handleSubmit = async (data: TradeSubmitData<Condition>) => {
    const payload = {
      accessoryId,
      accessoryVariantId,
      variantSlug,
      ...data,
    };

    if (initialData?.id) {
      await updateUserAccessory({ id: initialData.id, data: payload });
    } else {
      await createUserAccessory(payload);
    }
  };

  const conditionOptions: { value: Condition; label: string }[] = [
    { value: "NEW", label: t("conditionNew") },
    { value: "USED", label: t("conditionUsed") },
    { value: "REFURBISHED", label: t("conditionRefurbished") },
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
