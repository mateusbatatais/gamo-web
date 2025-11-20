// src/components/organisms/ConsoleForm/ConsoleForm.tsx
"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { AdditionalImagesUpload } from "@/components/molecules/AdditionalImagesUpload/AdditionalImagesUpload";
import { TradeSection } from "@/components/molecules/TradeSection/TradeSection";
import { MainImageUpload } from "@/components/molecules/MainImageUpload/MainImageUpload";
import { useUserConsoleMutation } from "@/hooks/useUserConsoleMutation";
import { useStorageOptions } from "@/hooks/useStorageOptions";
import { Select } from "@/components/atoms/Select/Select";
import { useAccessoryVariantsByConsole } from "@/hooks/useAccessoriesByConsole";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { AccessorySelector } from "@/components/molecules/AccessorySelector/AccessorySelector";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Radio } from "@/components/atoms/Radio/Radio";
import { CollectionStatus, Condition } from "@/@types/collection.types";

interface ConsoleFormProps {
  mode: "create" | "edit";
  type?: "collection" | "trade";
  consoleId: number;
  consoleVariantId: number;
  variantSlug: string;
  skinId?: number | null;
  initialData?: {
    id?: number;
    description?: string | null;
    status?: CollectionStatus;
    price?: number | null;
    hasBox?: boolean | null;
    hasManual?: boolean | null;
    condition?: Condition | null;
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

export const ConsoleForm = ({
  mode,
  type = "collection",
  consoleId,
  consoleVariantId,
  skinId,
  initialData,
  variantSlug,
  onSuccess,
  onCancel,
}: ConsoleFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserConsole, updateUserConsole, isPending } = useUserConsoleMutation();
  const { createUserAccessory } = useUserAccessoryMutation();
  const [showTrade, setShowTrade] = useState(false);
  const [keepCopyInCollection, setKeepCopyInCollection] = useState(false);

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

  const [formData, setFormData] = useState(() => {
    const status =
      mode === "edit"
        ? initialData?.status
        : mode === "create" && type === "trade"
          ? "SELLING"
          : "OWNED";

    return {
      description: initialData?.description || "",
      status,
      price: initialData?.price ? String(initialData.price) : "",
      hasBox: !!initialData?.hasBox,
      hasManual: !!initialData?.hasManual,
      condition: initialData?.condition || "USED",
      acceptsTrade: !!initialData?.acceptsTrade,
    };
  });

  useEffect(() => {
    if (formData.status !== "SELLING") {
      setKeepCopyInCollection(false);
    }
  }, [formData.status]);

  const { data: storageOptions, isLoading: storageOptionsLoading } =
    useStorageOptions(consoleVariantId);
  const { data: accessoryVariants, isLoading: accessoriesLoading } =
    useAccessoryVariantsByConsole(consoleId);

  const [selectedStorageOptionId, setSelectedStorageOptionId] = useState<number | undefined>(
    initialData?.storageOptionId ?? undefined,
  );

  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, SelectedAccessoryVariant>
  >({});

  const handleRadioChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSelectedAccessories = async (userConsoleId: number) => {
    if (!isAccessoriesOpen || !userConsoleId) return;
    for (const [variantId, selected] of Object.entries(selectedVariants)) {
      if (selected.quantity <= 0) continue;
      const variant = accessoryVariants?.find((v) => v.id === parseInt(variantId));
      if (!variant) continue;
      for (let i = 0; i < selected.quantity; i++) {
        await createUserAccessory({
          accessoryId: variant.accessoryId,
          accessoryVariantId: variant.id,
          status: formData.status,
          condition: formData.condition,
          compatibleUserConsoleIds: [userConsoleId],
        });
      }
    }
  };

  useEffect(() => {
    if (mode === "edit" && initialData?.id) {
      setIsAccessoriesOpen(true);
    }
  }, [mode, initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { mainPhotoUrl, additionalUrls } = await uploadImages();

    const payload = {
      consoleId,
      consoleVariantId,
      skinId: skinId || undefined,
      storageOptionId: selectedStorageOptionId,
      description: formData.description || undefined,
      status: formData.status ?? "OWNED",
      price: formData.price ? parseFloat(formData.price) : undefined,
      hasBox: formData.hasBox,
      hasManual: formData.hasManual,
      condition: formData.condition,
      acceptsTrade: formData.acceptsTrade,
      photoMain: mainPhotoUrl || undefined,
      photos: additionalUrls,
      variantSlug,
    };

    let userConsoleId: number | undefined;

    if (mode === "create") {
      const response = await createUserConsole(payload);
      userConsoleId = response.userConsole.id || 0;
    } else if (mode === "edit" && initialData?.id) {
      if (formData.status === "SELLING" && keepCopyInCollection && initialData.status === "OWNED") {
        const copyPayload = {
          ...payload,
          status: "PREVIOUSLY_OWNED" as const,
          price: undefined,
          acceptsTrade: false,
        };

        await createUserConsole(copyPayload);
      }

      await updateUserConsole({ id: initialData.id, data: payload });
      userConsoleId = initialData.id;
    } else {
      throw new Error("Invalid mode or missing initialData.id");
    }

    if (userConsoleId) {
      await addSelectedAccessories(userConsoleId);
    }

    onSuccess();
  };

  const conditionOptions = [
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {initialData?.status === "OWNED" && (
        <div className="space-y-3">
          <Checkbox
            label={t("putUpForSale", { item: t("console") })}
            checked={formData.status === "SELLING"}
            onChange={(e) => {
              const checked = e.target.checked;
              setFormData((prev) => ({
                ...prev,
                status: checked ? "SELLING" : "OWNED",
              }));
              setShowTrade(checked);
            }}
          />

          {formData.status === "SELLING" && (
            <div className="ml-6">
              <Checkbox
                label={t("keepCopyInCollection")}
                checked={keepCopyInCollection}
                onChange={(e) => setKeepCopyInCollection(e.target.checked)}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t("keepCopyInCollectionDescription")}
              </p>
            </div>
          )}
        </div>
      )}
      {initialData?.status === "LOOKING_FOR" && (
        <Checkbox
          label={t("moveToOwned", { item: t("console") })}
          checked={formData.status === "OWNED"}
          onChange={(e) => {
            const checked = e.target.checked;
            setFormData((prev) => ({
              ...prev,
              status: checked ? "OWNED" : "LOOKING_FOR",
            }));
          }}
        />
      )}
      {initialData?.status === "SELLING" && (
        <Checkbox
          label={t("backToCollection", { item: t("game") })}
          checked={formData.status === "OWNED"}
          onChange={(e) => {
            const checked = e.target.checked;
            setFormData((prev) => ({
              ...prev,
              status: checked ? "OWNED" : "SELLING",
            }));
          }}
        />
      )}
      {initialData?.status === "PREVIOUSLY_OWNED" && (
        <Checkbox
          label={t("moveToOwned", { item: t("console") })}
          checked={formData.status === "OWNED"}
          onChange={(e) => {
            const checked = e.target.checked;
            setFormData((prev) => ({
              ...prev,
              status: checked ? "OWNED" : "PREVIOUSLY_OWNED",
            }));
          }}
        />
      )}

      {mode === "create" && type === "collection" && (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Radio
              name="status"
              value="OWNED"
              checked={formData.status === "OWNED"}
              onChange={() => handleRadioChange("status", "OWNED")}
              label={t("statusOwned")}
            />
            <Radio
              name="status"
              value="PREVIOUSLY_OWNED"
              checked={formData.status === "PREVIOUSLY_OWNED"}
              onChange={() => handleRadioChange("status", "PREVIOUSLY_OWNED")}
              label={t("statusPreviouslyOwned")}
            />
          </div>
        </div>
      )}

      {mode === "create" && type === "trade" && (
        <div className="flex space-x-4">
          <Radio
            name="status"
            value="SELLING"
            checked={formData.status === "SELLING"}
            onChange={() => handleRadioChange("status", "SELLING")}
            label={t("statusSelling")}
          />
          <Radio
            name="status"
            value="LOOKING_FOR"
            checked={formData.status === "LOOKING_FOR"}
            onChange={() => handleRadioChange("status", "LOOKING_FOR")}
            label={t("statusLookingFor")}
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
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

      {(type === "trade" || showTrade) && (
        <>
          <TradeSection
            conditionOptions={conditionOptions}
            formData={formData}
            handleChange={handleChange}
            t={t}
            showPrice={true}
          />
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            label={t("description")}
            placeholder={t("descriptionPlaceholder")}
            rows={4}
          />

          <div className="mt-4">
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
        </>
      )}

      {accessoryVariants && accessoryVariants.length > 0 && (
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
      )}

      {currentCropImage && (
        <ImageCropper
          src={currentCropImage.url}
          onBlobReady={handleCropComplete}
          onCancel={() => setCurrentCropImage(null)}
        />
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} label={t("cancel")} />
        <Button
          type="submit"
          loading={isPending || uploadLoading}
          label={mode === "create" ? t("addToCollection") : t("saveChanges")}
        />
      </div>
    </form>
  );
};
