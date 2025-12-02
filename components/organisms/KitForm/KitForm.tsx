"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { UserKit } from "@/@types/collection.types";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { MainImageUpload } from "@/components/molecules/MainImageUpload/MainImageUpload";
import { AdditionalImagesUpload } from "@/components/molecules/AdditionalImagesUpload/AdditionalImagesUpload";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { useKitMutation } from "@/hooks/useKitMutation";
import { useToast } from "@/contexts/ToastContext";

interface KitFormProps {
  initialData?: UserKit;
}

export const KitForm = ({ initialData }: KitFormProps) => {
  const t = useTranslations("KitForm");
  const router = useRouter();
  const { createKit, updateKit, isPending } = useKitMutation();
  const { showToast } = useToast();

  const [selectedGames, setSelectedGames] = useState<CatalogGameItem[]>([]);
  const [selectedConsoles, setSelectedConsoles] = useState<CatalogConsoleItem[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<CatalogAccessoryItem[]>([]);

  const {
    photoMain,
    additionalPhotos,
    currentCropImage,
    mainFileInputRef,
    additionalFileInputRef,
    loading: uploadLoading,
    handleImageUpload,
    handleCropComplete,
    removeImage,
    uploadImages,
    setCurrentCropImage,
    setPhotoMain,
    setAdditionalPhotos,
  } = useCollectionForm(initialData?.photos || [], initialData?.photoMain || undefined);

  const kitSchema = z.object({
    name: z.string().min(3, t("validation.nameMin")),
    description: z.string().optional(),
    price: z.coerce.number().min(0.01, t("validation.priceMin")),
  });

  type KitFormData = z.infer<typeof kitSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<KitFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(kitSchema as any),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        price: initialData.price,
      });
      setSelectedGames(
        initialData.items.games.map((g) => ({
          internalId: Math.random().toString(36).substr(2, 9),
          gameId: g.gameId,
          userGameId: g.id,
          platformId: g.platformId || 0,
          name: g.gameTitle || "Unknown Game",
          imageUrl: g.gameImageUrl,
          platformName: "",
          platforms: [],
        })),
      );
      setSelectedConsoles(
        initialData.items.consoles.map((c) => ({
          internalId: Math.random().toString(36).substr(2, 9),
          consoleId: c.consoleId,
          userConsoleId: c.id,
          consoleVariantId: c.consoleVariantId,
          skinId: c.skinId || undefined,
          name: c.consoleName || "Unknown Console",
          variantName: c.variantName || "Unknown Variant",
          imageUrl: c.photoMain,
          skins: [],
        })),
      );
      setSelectedAccessories(
        initialData.items.accessories.map((a) => ({
          internalId: Math.random().toString(36).substr(2, 9),
          accessoryId: a.accessoryId || 0,
          userAccessoryId: a.id,
          accessoryVariantId: a.accessoryVariantId || 0,
          name: a.accessoryName || "Accessory",
          imageUrl: a.photoMain,
          type: a.type || "",
        })),
      );
    }
  }, [initialData, reset]);

  const onSubmit = async (data: KitFormData) => {
    if (
      selectedGames.length === 0 &&
      selectedConsoles.length === 0 &&
      selectedAccessories.length === 0
    ) {
      showToast(t("selectItemWarning"), "warning");
      return;
    }

    const { mainPhotoUrl, additionalUrls } = await uploadImages();

    // Split items into existing (UserItems) and new (CatalogItems)
    const gameIds = selectedGames.filter((g) => g.userGameId).map((g) => g.userGameId!);

    const newGames = selectedGames
      .filter((g) => !g.userGameId)
      .map((g) => ({
        gameId: g.gameId,
        platformId: g.platformId,
        condition: "USED" as const,
        hasBox: false,
        hasManual: false,
        media: "PHYSICAL" as const,
      }));

    const consoleIds = selectedConsoles.filter((c) => c.userConsoleId).map((c) => c.userConsoleId!);

    const newConsoles = selectedConsoles
      .filter((c) => !c.userConsoleId)
      .map((c) => ({
        consoleId: c.consoleId,
        consoleVariantId: c.consoleVariantId,
        skinId: c.skinId,
        condition: "USED" as const,
        hasBox: false,
        hasManual: false,
      }));

    const accessoryIds = selectedAccessories
      .filter((a) => a.userAccessoryId)
      .map((a) => a.userAccessoryId!);

    const newAccessories = selectedAccessories
      .filter((a) => !a.userAccessoryId)
      .map((a) => ({
        accessoryId: a.accessoryId,
        accessoryVariantId: a.accessoryVariantId,
        condition: "USED" as const,
        hasBox: false,
        hasManual: false,
      }));

    const payload = {
      ...data,
      gameIds,
      newGames,
      consoleIds,
      newConsoles,
      accessoryIds,
      newAccessories,
      photoMain: mainPhotoUrl || undefined,
      photos: additionalUrls,
    };

    if (initialData) {
      await updateKit({ id: initialData.id, data: payload });
    } else {
      await createKit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {initialData ? t("editTitle") : t("createTitle")}
        </h2>

        <div className="mb-6">
          <MainImageUpload
            label={t("mainPhoto")}
            photo={photoMain}
            fileInputRef={mainFileInputRef}
            onImageUpload={(e) => handleImageUpload(e, "main")}
            onRemove={() => removeImage("main")}
            onCropComplete={(blob) => {
              const url = URL.createObjectURL(blob);
              setPhotoMain({ url, blob });
            }}
            t={t}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label={t("name")}
            {...register("name")}
            error={errors.name?.message}
            placeholder={t("namePlaceholder")}
          />
          <Input
            label={t("price")}
            type="number"
            step="0.01"
            {...register("price")}
            error={errors.price?.message}
            placeholder="0.00"
            icon={<span className="text-gray-500">R$</span>}
          />
        </div>

        <Textarea
          label={t("description")}
          {...register("description")}
          error={errors.description?.message}
          placeholder={t("descriptionPlaceholder")}
          rows={4}
        />

        <div className="mt-6">
          <AdditionalImagesUpload
            label={t("additionalPhotos")}
            photos={additionalPhotos}
            fileInputRef={additionalFileInputRef}
            onImageUpload={(e) => handleImageUpload(e, "additional")}
            onRemove={(index) => removeImage("additional", index)}
            onCropComplete={(blob, index) => {
              const url = URL.createObjectURL(blob);
              const newPhotos = [...additionalPhotos];
              newPhotos[index] = { url, blob };
              setAdditionalPhotos(newPhotos);
            }}
            t={t}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg  shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
          {t("itemsTitle")}
        </h3>

        <CatalogGameSelector
          label={t("gamesLabel")}
          placeholder={t("gamesPlaceholder")}
          selectedItems={selectedGames}
          onItemSelect={(item) => setSelectedGames((prev) => [...prev, item])}
          onItemRemove={(id) => setSelectedGames((prev) => prev.filter((i) => i.internalId !== id))}
        />

        <CatalogAccessorySelector
          label={t("accessoriesLabel")}
          placeholder={t("accessoriesPlaceholder")}
          selectedItems={selectedAccessories}
          onItemSelect={(item) => setSelectedAccessories((prev) => [...prev, item])}
          onItemRemove={(id) =>
            setSelectedAccessories((prev) => prev.filter((i) => i.internalId !== id))
          }
        />

        <CatalogConsoleSelector
          label={t("consolesLabel")}
          placeholder={t("consolesPlaceholder")}
          selectedItems={selectedConsoles}
          onItemSelect={(item) => setSelectedConsoles((prev) => [...prev, item])}
          onItemRemove={(id) =>
            setSelectedConsoles((prev) => prev.filter((i) => i.internalId !== id))
          }
          onItemUpdate={(updatedItem) => {
            setSelectedConsoles((prev) =>
              prev.map((item) => (item.internalId === updatedItem.internalId ? updatedItem : item)),
            );
          }}
        />
      </div>

      {currentCropImage && (
        <ImageCropper
          src={currentCropImage.url}
          onBlobReady={handleCropComplete}
          onCancel={() => setCurrentCropImage(null)}
        />
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending || uploadLoading}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" loading={isPending || uploadLoading}>
          {initialData ? t("updateButton") : t("createButton")}
        </Button>
      </div>
    </form>
  );
};
