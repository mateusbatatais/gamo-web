"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import { useTranslations } from "next-intl";
import {
  CatalogGameSelector,
  CatalogGameItem,
} from "@/components/molecules/CatalogGameSelector/CatalogGameSelector";
import {
  CatalogConsoleSelector,
  CatalogConsoleItem,
} from "@/components/molecules/CatalogConsoleSelector/CatalogConsoleSelector";
import {
  CatalogAccessorySelector,
  CatalogAccessoryItem,
} from "@/components/molecules/CatalogAccessorySelector/CatalogAccessorySelector";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Button } from "@/components/atoms/Button/Button";

export const KitForm = () => {
  const t = useTranslations("KitForm");
  const router = useRouter();
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedGames, setSelectedGames] = useState<CatalogGameItem[]>([]);
  const [selectedConsoles, setSelectedConsoles] = useState<CatalogConsoleItem[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<CatalogAccessoryItem[]>([]);

  const createKitSchema = z.object({
    name: z.string().min(3, t("validation.nameMin")),
    description: z.string().optional(),
    price: z.coerce.number().min(0.01, t("validation.priceMin")),
  });

  type CreateKitFormData = z.infer<typeof createKitSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateKitFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createKitSchema as any),
  });

  const onSubmit = async (data: CreateKitFormData) => {
    if (
      selectedGames.length === 0 &&
      selectedConsoles.length === 0 &&
      selectedAccessories.length === 0
    ) {
      showToast(t("selectItemWarning"), "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("/kits", {
        method: "POST",
        body: {
          ...data,
          // Send new games to be created
          newGames: selectedGames.map((i) => ({
            gameId: i.gameId,
            platformId: i.platformId,
            condition: "USED",
            hasBox: false,
            hasManual: false,
            media: "PHYSICAL",
          })),
          // Send new consoles/accessories to be created
          newConsoles: selectedConsoles.map((i) => ({
            consoleId: i.consoleId,
            consoleVariantId: i.consoleVariantId,
            skinId: i.skinId,
            condition: "USED", // Defaulting to USED for now
            hasBox: false,
            hasManual: false,
          })),
          newAccessories: selectedAccessories.map((i) => ({
            accessoryId: i.accessoryId,
            accessoryVariantId: i.accessoryVariantId,
            condition: "USED",
            hasBox: false,
            hasManual: false,
          })),
          gameIds: [], // We are creating new ones
          consoleIds: [], // We are creating new ones
          accessoryIds: [], // We are creating new ones
        },
      });

      showToast(t("successMessage"), "success");
      router.push("/marketplace");
    } catch (error) {
      console.error("Error creating kit:", error);
      showToast(t("errorMessage"), "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
      </div>

      {/* Basic Info */}
      <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("basicInfo")}
        </h2>

        <div className="space-y-2">
          <Input
            id="name"
            label={t("nameLabel")}
            placeholder={t("namePlaceholder")}
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <div className="space-y-2">
          <Textarea
            id="description"
            label={t("descriptionLabel")}
            placeholder={t("descriptionPlaceholder")}
            rows={4}
            {...register("description")}
          />
        </div>

        <div className="space-y-2">
          <Input
            id="price"
            type="number"
            step="0.01"
            label={t("priceLabel")}
            placeholder={t("pricePlaceholder")}
            error={errors.price?.message}
            {...register("price")}
          />
        </div>
      </div>

      {/* Items Selection */}
      <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("selectItems")}
        </h2>

        <CatalogGameSelector
          label={t("gamesLabel")}
          placeholder={t("gamesPlaceholder")}
          selectedItems={selectedGames}
          onItemSelect={(item) => setSelectedGames((prev) => [...prev, item])}
          onItemRemove={(id) => setSelectedGames((prev) => prev.filter((i) => i.gameId !== id))}
        />

        <CatalogAccessorySelector
          label={t("accessoriesLabel")}
          placeholder={t("accessoriesPlaceholder")}
          selectedItems={selectedAccessories}
          onItemSelect={(item) => setSelectedAccessories((prev) => [...prev, item])}
          onItemRemove={(id) =>
            setSelectedAccessories((prev) => prev.filter((i) => i.accessoryVariantId !== id))
          }
        />

        <CatalogConsoleSelector
          label={t("consolesLabel")}
          placeholder={t("consolesPlaceholder")}
          selectedItems={selectedConsoles}
          onItemSelect={(item) => setSelectedConsoles((prev) => [...prev, item])}
          onItemRemove={(id) =>
            setSelectedConsoles((prev) => prev.filter((i) => i.consoleVariantId !== id))
          }
          onItemUpdate={(updatedItem) => {
            setSelectedConsoles((prev) =>
              prev.map((item) =>
                item.consoleVariantId === updatedItem.consoleVariantId ? updatedItem : item,
              ),
            );
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="px-8 py-3"
          label={isSubmitting ? t("submittingButton") : t("submitButton")}
        />
      </div>
    </form>
  );
};
