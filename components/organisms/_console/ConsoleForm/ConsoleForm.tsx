// src/components/organisms/ConsoleForm/ConsoleForm.tsx
"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import Image from "next/image";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { AdditionalImagesUpload } from "@/components/molecules/AdditionalImagesUpload/AdditionalImagesUpload";
import { TradeSection } from "@/components/molecules/TradeSection/TradeSection";
import { MainImageUpload } from "@/components/molecules/MainImageUpload/MainImageUpload";
import { useUserConsoleMutation } from "@/hooks/useUserConsoleMutation";
import { useStorageOptions } from "@/hooks/useStorageOptions";
import { Select } from "@/components/atoms/Select/Select";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Counter } from "@/components/atoms/Counter/Counter";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { useAccessoryVariantsByConsole } from "@/hooks/useAccessoriesByConsole";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { normalizeImageUrl } from "@/utils/validate-url";
import { Gamepad } from "lucide-react";

interface ConsoleFormProps {
  mode: "create" | "edit";
  consoleId: number;
  consoleVariantId: number;
  variantSlug: string;
  skinId?: number | null;
  initialData?: {
    id?: number;
    description?: string | null;
    status?: "OWNED" | "SELLING" | "LOOKING_FOR";
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

export const ConsoleForm = ({
  mode,
  consoleId,
  consoleVariantId,
  skinId,
  initialData,
  variantSlug,
  onSuccess,
  onCancel,
}: ConsoleFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserConsole, updateUserConsole } = useUserConsoleMutation();
  const { createUserAccessory } = useUserAccessoryMutation();

  const {
    photoMain,
    additionalPhotos,
    currentCropImage,
    mainFileInputRef,
    additionalFileInputRef,
    handleImageUpload,
    handleCropComplete,
    removeImage,
    uploadImages,
    setCurrentCropImage,
    setPhotoMain,
    setAdditionalPhotos,
  } = useCollectionForm(initialData?.photos || [], initialData?.photoMain || undefined);

  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    status: initialData?.status || "OWNED",
    price: initialData?.price ? String(initialData.price) : "",
    hasBox: initialData?.hasBox || false,
    hasManual: initialData?.hasManual || false,
    condition: initialData?.condition || "USED",
    acceptsTrade: initialData?.acceptsTrade || false,
  });

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData?.id) {
      setIncludeAccessories(true);
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

  const handleImageError = (variantId: number) => {
    setImageError((prev) => ({ ...prev, [variantId]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { mainPhotoUrl, additionalUrls } = await uploadImages();

      const payload = {
        consoleId,
        consoleVariantId,
        skinId: skinId || undefined,
        storageOptionId: selectedStorageOptionId,
        description: formData.description || undefined,
        status: formData.status,
        price: formData.price ? parseFloat(formData.price) : undefined,
        hasBox: formData.hasBox,
        hasManual: formData.hasManual,
        condition: formData.condition,
        acceptsTrade: formData.acceptsTrade,
        photoMain: mainPhotoUrl || undefined,
        photos: additionalUrls,
        variantSlug,
      };

      let userConsoleId: number;
      if (mode === "create") {
        const response = await createUserConsole(payload);
        userConsoleId = response.userConsole.id || 0;
      } else if (mode === "edit" && initialData?.id) {
        await updateUserConsole({ id: initialData.id, data: payload });
        userConsoleId = initialData.id;
      } else {
        throw new Error("Invalid mode or missing initialData.id");
      }

      if (includeAccessories && userConsoleId) {
        for (const [variantId, selected] of Object.entries(selectedVariants)) {
          if (selected.quantity > 0) {
            const variant = accessoryVariants?.find((v) => v.id === parseInt(variantId));
            if (variant) {
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
          }
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditionOptions = [
    { value: "NEW", label: t("conditionNew") },
    { value: "USED", label: t("conditionUsed") },
    { value: "REFURBISHED", label: t("conditionRefurbished") },
  ];

  const statusOptions = [
    { value: "OWNED", label: t("statusOwned") },
    { value: "SELLING", label: t("statusSelling") },
    { value: "LOOKING_FOR", label: t("statusLookingFor") },
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          disabled={storageOptionsLoading || isSubmitting}
        />
      )}

      {accessoryVariants && accessoryVariants.length > 0 && (
        <div className="mt-4">
          <Checkbox
            name="includeAccessories"
            checked={includeAccessories}
            onChange={(e) => setIncludeAccessories(e.target.checked)}
            label={t("includeAccessories")}
            disabled={isSubmitting}
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
        </div>
      )}

      <Collapse title={t("tradeSection")} defaultOpen={formData.status !== "OWNED"}>
        <TradeSection
          conditionOptions={conditionOptions}
          statusOptions={statusOptions}
          formData={formData}
          handleChange={handleChange}
          t={t}
          showPrice={true}
          showStatus={true}
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
      </Collapse>

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
          loading={isSubmitting}
          label={mode === "create" ? t("addToCollection") : t("saveChanges")}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
