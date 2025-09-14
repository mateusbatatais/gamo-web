// components/molecules/SimpleConsoleForm/SimpleConsoleForm.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { useStorageOptions } from "@/hooks/useStorageOptions";
import { Select } from "@/components/atoms/Select/Select";
import { useUserConsoleMutation } from "@/hooks/useUserConsoleMutation";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import { useAccessoryVariantsByConsole } from "@/hooks/useAccessoriesByConsole";
import { AccessorySelector } from "../../AccessorySelector/AccessorySelector";

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
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, SelectedAccessoryVariant>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (isAccessoriesOpen && userConsoleResponse && userConsoleResponse.userConsole.id) {
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

  const handleAccessoriesToggle = (open: boolean) => {
    setIsAccessoriesOpen(open);
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

      <Collapse
        title={t("includeAccessories")}
        defaultOpen={false}
        onToggle={handleAccessoriesToggle}
      >
        <AccessorySelector
          variantsByType={variantsByType || {}}
          selectedVariants={selectedVariants}
          onQuantityChange={handleQuantityChange}
          isLoading={accessoriesLoading}
        />
      </Collapse>

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
