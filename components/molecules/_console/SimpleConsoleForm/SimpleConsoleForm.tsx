// components/molecules/SimpleConsoleForm/SimpleConsoleForm.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import { useStorageOptions } from "@/hooks/useStorageOptions";
import { Select } from "@/components/atoms/Select/Select";
import { useUserConsoleMutation } from "@/hooks/useUserConsoleMutation";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Counter } from "@/components/atoms/Counter/Counter";
import { useAccessoryVariantsByConsole } from "@/hooks/useAccessoriesByConsole";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import { Gamepad } from "lucide-react";
import { normalizeImageUrl } from "@/utils/validate-url";

interface SimpleConsoleFormProps {
  consoleId: number;
  consoleVariantId: number;
  variantSlug: string;
  skinId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

interface SelectedAccessoryVariant {
  variantId: number;
  quantity: number;
}

export const SimpleConsoleForm = ({
  consoleId,
  consoleVariantId,
  variantSlug,
  skinId,
  onSuccess,
  onCancel,
}: SimpleConsoleFormProps) => {
  const t = useTranslations("SimpleConsoleForm");
  const { data: storageOptions, isLoading: storageOptionsLoading } =
    useStorageOptions(consoleVariantId);
  const { data: accessoryVariants, isLoading: accessoriesLoading } =
    useAccessoryVariantsByConsole(consoleId);
  const { createUserConsole } = useUserConsoleMutation();
  const { createUserAccessory } = useUserAccessoryMutation();
  const [selectedStorageOptionId, setSelectedStorageOptionId] = useState<number>();
  const [includeAccessories, setIncludeAccessories] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, SelectedAccessoryVariant>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const userConsoleResponse = await createUserConsole({
        consoleId,
        consoleVariantId,
        variantSlug,
        skinId: skinId || undefined,
        storageOptionId: selectedStorageOptionId,
        status: "OWNED",
        condition: "USED",
      });

      if (includeAccessories && userConsoleResponse && userConsoleResponse.userConsole.id) {
        for (const [variantId, selected] of Object.entries(selectedVariants)) {
          if (selected.quantity > 0) {
            const variant = accessoryVariants?.find((v) => v.id === parseInt(variantId));
            if (variant) {
              for (let i = 0; i < selected.quantity; i++) {
                await createUserAccessory({
                  accessoryId: variant.accessoryId,
                  accessoryVariantId: variant.id,
                  status: "OWNED",
                  condition: "USED",
                  compatibleUserConsoleIds: [userConsoleResponse.userConsole.id],
                });
              }
            }
          }
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error adding console to collection:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="space-y-4">
      {storageOptionsLoading && <Spinner />}

      {storageOptions && storageOptions.length > 0 && (
        <Select
          label={t("storageOption")}
          value={selectedStorageOptionId?.toString() || ""}
          onChange={(e) =>
            setSelectedStorageOptionId(e.target.value ? parseInt(e.target.value) : undefined)
          }
          options={storageOptions.map((option) => ({
            value: option.id.toString(),
            label: `${option.value} ${option.unit}${option.note ? ` (${option.note})` : ""}`,
          }))}
        />
      )}

      <Checkbox
        label={t("includeAccessories")}
        checked={includeAccessories}
        onChange={(e) => setIncludeAccessories(e.target.checked)}
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

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting} label={t("cancel")} />
        <Button
          loading={isSubmitting}
          onClick={handleSubmit}
          label={t("add")}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};
