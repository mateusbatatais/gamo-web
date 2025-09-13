// components/molecules/TradeConsoleForm/TradeConsoleForm.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useUserConsoleMutation } from "@/hooks/useUserConsoleMutation";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { useStorageOptions } from "@/hooks/useStorageOptions";
import { useAccessoryVariantsByConsole } from "@/hooks/useAccessoriesByConsole";
import TradeFormBase, { TradeSubmitData } from "@/components/molecules/TradeFormBase/TradeFormBase";
import { Select } from "@/components/atoms/Select/Select";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import { Counter } from "@/components/atoms/Counter/Counter";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { Gamepad } from "lucide-react";
import Image from "next/image";
import { normalizeImageUrl } from "@/utils/validate-url";

interface TradeConsoleFormProps {
  consoleId: number;
  consoleVariantId: number;
  variantSlug: string;
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
    storageOptionId?: number | null;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

interface SelectedAccessoryVariant {
  variantId: number;
  quantity: number;
}

export const TradeConsoleForm = ({
  consoleId,
  consoleVariantId,
  variantSlug,
  skinId,
  initialData,
  onSuccess,
  onCancel,
}: TradeConsoleFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserConsole, updateUserConsole, isPending } = useUserConsoleMutation();
  const { createUserAccessory } = useUserAccessoryMutation();
  const { data: storageOptions, isLoading: storageOptionsLoading } =
    useStorageOptions(consoleVariantId);
  const { data: accessoryVariants, isLoading: accessoriesLoading } =
    useAccessoryVariantsByConsole(consoleId);
  const [selectedStorageOptionId, setSelectedStorageOptionId] = useState<number | undefined>(
    initialData?.storageOptionId ?? undefined,
  );
  const [includeAccessories, setIncludeAccessories] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, SelectedAccessoryVariant>
  >({});
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleSubmit = async (data: TradeSubmitData<"NEW" | "USED" | "REFURBISHED">) => {
    const payload = {
      consoleId,
      variantSlug,
      consoleVariantId,
      skinId: skinId || undefined,
      storageOptionId: selectedStorageOptionId,
      ...data,
    };

    let userConsoleResponse;
    if (initialData?.id) {
      userConsoleResponse = await updateUserConsole({ id: initialData.id, data: payload });
    } else {
      userConsoleResponse = await createUserConsole(payload);
    }

    // Se o usuário quer incluir acessórios e a criação/atualização foi bem-sucedida
    if (includeAccessories && userConsoleResponse && userConsoleResponse.userConsole.id) {
      const userConsoleId = userConsoleResponse.userConsole.id;
      for (const [variantId, selected] of Object.entries(selectedVariants)) {
        if (selected.quantity > 0) {
          const variant = accessoryVariants?.find((v) => v.id === parseInt(variantId));
          if (variant) {
            for (let i = 0; i < selected.quantity; i++) {
              await createUserAccessory({
                accessoryId: variant.accessoryId,
                accessoryVariantId: variant.id,
                status: data.status,
                condition: data.condition,
                compatibleUserConsoleIds: [userConsoleId],
              });
            }
          }
        }
      }
    }

    onSuccess();
  };

  const handleQuantityChange = (variantId: number, newQuantity: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: { variantId, quantity: Math.max(0, newQuantity) },
    }));
  };

  const handleImageError = (variantId: number) => {
    setImageError((prev) => ({ ...prev, [variantId]: true }));
  };

  const conditionOptions: { value: "NEW" | "USED" | "REFURBISHED"; label: string }[] = [
    { value: "NEW", label: t("conditionNew") },
    { value: "USED", label: t("conditionUsed") },
    { value: "REFURBISHED", label: t("conditionRefurbished") },
  ];

  const storageOptionOptions =
    storageOptions?.map((option) => ({
      value: option.id.toString(),
      label: `${option.value} ${option.unit}${option.note ? ` (${option.note})` : ""}`,
    })) || [];

  const variantsByType = accessoryVariants?.reduce(
    (acc, variant) => {
      if (!acc[variant.type]) {
        acc[variant.type] = [];
      }
      acc[variant.type].push(variant);
      return acc;
    },
    {} as Record<string, typeof accessoryVariants>,
  );

  const extraFields = (
    <>
      {storageOptionOptions.length > 0 && (
        <Select
          name="storageOptionId"
          value={selectedStorageOptionId?.toString() || ""}
          onChange={(e) =>
            setSelectedStorageOptionId(e.target.value ? parseInt(e.target.value) : undefined)
          }
          label={t("storageOption")}
          options={storageOptionOptions}
          disabled={storageOptionsLoading}
        />
      )}

      <Checkbox
        name="includeAccessories"
        checked={includeAccessories}
        onChange={(e) => setIncludeAccessories(e.target.checked)}
        label={t("includeAccessories")}
      />

      {includeAccessories && (
        <div className="mt-4">
          <h4 className="font-medium mb-3">{t("selectAccessories")}</h4>
          {accessoriesLoading ? (
            <Spinner />
          ) : variantsByType && Object.keys(variantsByType).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(variantsByType).map(([type, typeVariants]) => (
                <Collapse key={type} title={type} defaultOpen>
                  <div className="grid grid-cols-1 gap-3">
                    {typeVariants.map((variant) => {
                      const selected = selectedVariants[variant.id] || {
                        variantId: variant.id,
                        quantity: 0,
                      };
                      return (
                        <div
                          key={variant.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-12 h-12 relative flex-shrink-0">
                              {variant.imageUrl && !imageError[variant.id] ? (
                                <Image
                                  src={normalizeImageUrl(variant.imageUrl)}
                                  alt={variant.name}
                                  fill
                                  className="object-cover rounded"
                                  onError={() => handleImageError(variant.id)}
                                />
                              ) : (
                                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                                  <Gamepad size={24} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{variant.name}</p>
                              {variant.editionName && (
                                <p className="text-xs text-gray-500 truncate">
                                  {variant.editionName}
                                </p>
                              )}
                            </div>
                          </div>
                          <Counter
                            value={selected.quantity}
                            onIncrement={() =>
                              handleQuantityChange(variant.id, selected.quantity + 1)
                            }
                            onDecrement={() =>
                              handleQuantityChange(variant.id, selected.quantity - 1)
                            }
                            min={0}
                            max={10}
                          />
                        </div>
                      );
                    })}
                  </div>
                </Collapse>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("noAccessories")}</p>
          )}
        </div>
      )}
    </>
  );

  return (
    <TradeFormBase<"NEW" | "USED" | "REFURBISHED">
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
