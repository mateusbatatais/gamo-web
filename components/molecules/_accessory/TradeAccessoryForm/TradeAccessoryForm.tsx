"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import TradeFormBase, {
  TradeSubmitData,
  StatusType,
} from "@/components/molecules/TradeFormBase/TradeFormBase";
import { Condition } from "@/@types/collection.types";
import { useUserConsoles } from "@/hooks/useUserConsoles";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Spinner } from "@/components/atoms/Spinner/Spinner";

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
  const { data: userConsoles, isLoading } = useUserConsoles();
  const [selectedConsoleIds, setSelectedConsoleIds] = useState<number[]>([]);

  const ownedConsoles = userConsoles?.filter((console) => console.status === "OWNED") || [];

  const handleCheckboxChange = (consoleId: number) => {
    setSelectedConsoleIds((prev) =>
      prev.includes(consoleId) ? prev.filter((id) => id !== consoleId) : [...prev, consoleId],
    );
  };

  const handleSubmit = async (data: TradeSubmitData<Condition>) => {
    const payload = {
      accessoryId,
      accessoryVariantId,
      variantSlug,
      ...data,
      compatibleUserConsoleIds: selectedConsoleIds,
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

  const extraFields = (
    <div>
      <h4 className="font-medium mb-2">{t("compatibleConsoles")}</h4>
      {isLoading ? (
        <Spinner />
      ) : ownedConsoles.length === 0 ? (
        <p className="text-sm text-gray-500">{t("noConsoles")}</p>
      ) : (
        <div className="space-y-2">
          {ownedConsoles.map((userConsole) => (
            <Checkbox
              key={userConsole.id}
              label={userConsole.name}
              checked={selectedConsoleIds.includes(userConsole.id)}
              onChange={() => handleCheckboxChange(userConsole.id)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <TradeFormBase<Condition>
      t={t}
      initialData={initialData}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      isSubmitting={isPending}
      conditionOptions={conditionOptions}
      extraFields={extraFields}
    />
  );
};
