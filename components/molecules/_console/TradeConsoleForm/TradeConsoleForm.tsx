// components/molecules/TradeConsoleForm/TradeConsoleForm.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useUserConsoleMutation } from "@/hooks/useUserConsoleMutation";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import { useStorageOptions } from "@/hooks/useStorageOptions";
import { useAccessoryVariantsByConsole } from "@/hooks/useAccessoriesByConsole";
import TradeFormBase, { TradeSubmitData } from "@/components/molecules/TradeFormBase/TradeFormBase";
import { Select } from "@/components/atoms/Select/Select";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import { AccessorySelector } from "../../AccessorySelector/AccessorySelector";
import { GameSelector, SelectedGameVariant } from "../../GameSelector/GameSelector";

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
    address?: string | null;
    zipCode?: string | null;
    city?: string | null;
    state?: string | null;
    latitude?: number | null;
    longitude?: number | null;
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
  const { createUserGame } = useUserGameMutation();
  const { data: storageOptions, isLoading: storageOptionsLoading } =
    useStorageOptions(consoleVariantId);
  const { data: accessoryVariants, isLoading: accessoriesLoading } =
    useAccessoryVariantsByConsole(consoleId);

  const [selectedStorageOptionId, setSelectedStorageOptionId] = useState<number | undefined>(
    initialData?.storageOptionId ?? undefined,
  );
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, SelectedAccessoryVariant>
  >({});
  const [selectedGameVariants, setSelectedGameVariants] = useState<
    Record<number, SelectedGameVariant>
  >({});
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);

  const addSelectedAccessories = async (
    userConsoleId: number,
    status: "SELLING" | "LOOKING_FOR",
    condition: "NEW" | "USED" | "REFURBISHED",
  ) => {
    if (!isAccessoriesOpen || !userConsoleId) return;
    for (const [variantId, selected] of Object.entries(selectedVariants)) {
      if (selected.quantity <= 0) continue;
      const variant = accessoryVariants?.find((v) => v.id === parseInt(variantId));
      if (!variant) continue;
      for (let i = 0; i < selected.quantity; i++) {
        await createUserAccessory({
          accessoryId: variant.accessoryId,
          accessoryVariantId: variant.id,
          status,
          condition,
          compatibleUserConsoleIds: [userConsoleId],
        });
      }
    }
  };

  const addSelectedGames = async (
    userConsoleId: number,
    status: "SELLING" | "LOOKING_FOR",
    condition: "NEW" | "USED" | "REFURBISHED",
  ) => {
    if (!isGamesOpen || !userConsoleId) return;
    for (const selected of Object.values(selectedGameVariants)) {
      if (selected.quantity <= 0) continue;

      for (let i = 0; i < selected.quantity; i++) {
        await createUserGame({
          gameId: selected.variantId,
          gameSlug: selected.slug,
          media: "PHYSICAL",
          status,
          condition,
          compatibleUserConsoleIds: [userConsoleId],
        });
      }
    }
  };

  const handleSubmit = async (data: TradeSubmitData<"NEW" | "USED" | "REFURBISHED">) => {
    const payload = {
      consoleId,
      variantSlug,
      consoleVariantId,
      skinId: skinId || undefined,
      storageOptionId: selectedStorageOptionId,
      ...data,
    };

    const userConsoleResponse = initialData?.id
      ? await updateUserConsole({ id: initialData.id, data: payload })
      : await createUserConsole(payload);

    const userConsoleId = userConsoleResponse?.userConsole?.id;
    if (userConsoleId) {
      await addSelectedAccessories(userConsoleId, data.status, data.condition);
      await addSelectedGames(userConsoleId, data.status, data.condition);
    }

    onSuccess();
  };

  const handleQuantityChange = (variantId: number, newQuantity: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: { variantId, quantity: Math.max(0, newQuantity) },
    }));
  };

  const handleGameQuantityChange = (variantId: number, newQuantity: number) => {
    setSelectedGameVariants((prev) => {
      if (!prev[variantId]) return prev;
      return {
        ...prev,
        [variantId]: { ...prev[variantId], quantity: Math.max(0, newQuantity) },
      };
    });
  };

  const handleAddGame = (game: SelectedGameVariant) => {
    setSelectedGameVariants((prev) => {
      if (prev[game.variantId]) return prev;
      return {
        ...prev,
        [game.variantId]: game,
      };
    });
  };

  const handleRemoveGame = (variantId: number) => {
    setSelectedGameVariants((prev) => {
      const newState = { ...prev };
      delete newState[variantId];
      return newState;
    });
  };

  const handleAccessoriesToggle = (open: boolean) => {
    setIsAccessoriesOpen(open);
  };

  const handleGamesToggle = (open: boolean) => {
    setIsGamesOpen(open);
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
      if (!acc[variant.type as string]) {
        acc[variant.type as string] = [];
      }
      acc[variant.type as string].push(variant);
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

      <Collapse title={t("includeGames")} defaultOpen={false} onToggle={handleGamesToggle}>
        <GameSelector
          consoleId={consoleId}
          selectedVariants={selectedGameVariants}
          onQuantityChange={handleGameQuantityChange}
          onRemoveGame={handleRemoveGame}
          onAddGame={handleAddGame}
        />
      </Collapse>
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
      showLocation={true}
    />
  );
};
