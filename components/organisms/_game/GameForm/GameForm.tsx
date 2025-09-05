// src/components/organisms/GameForm/GameForm.tsx
"use client";

import React, { ChangeEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Select } from "@/components/atoms/Select/Select";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Collapse } from "@/components/atoms/Collapse/Collapse";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { AdditionalImagesUpload } from "@/components/molecules/AdditionalImagesUpload/AdditionalImagesUpload";
import { TradeSection } from "@/components/molecules/TradeSection/TradeSection";
import { MainImageUpload } from "@/components/molecules/MainImageUpload/MainImageUpload";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import { Rating } from "@/components/atoms/Rating/Rating";
import { Range } from "@/components/atoms/Range/Range";
import { SelectOption } from "@/components/atoms/Select/Select";

interface GameFormProps {
  mode: "create" | "edit";
  gameId: number;
  platformOptions: SelectOption[];
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
    progress?: number | null;
    rating?: number | null;
    review?: string | null;
    abandoned?: boolean | null;
    media?: "PHYSICAL" | "DIGITAL";
    platformId?: number;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const GameForm = ({
  mode,
  gameId,
  platformOptions,
  initialData,
  onSuccess,
  onCancel,
}: GameFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserGame, updateUserGame, isPending } = useUserGameMutation();

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

  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    status: initialData?.status || "OWNED",
    price: initialData?.price ? String(initialData.price) : "",
    hasBox: initialData?.hasBox || false,
    hasManual: initialData?.hasManual || false,
    condition: initialData?.condition || "USED",
    acceptsTrade: initialData?.acceptsTrade || false,
    progress: initialData?.progress ? String(initialData.progress) : "",
    rating: initialData?.rating ? initialData.rating : 0,
    review: initialData?.review || "",
    abandoned: initialData?.abandoned || false,
    media: initialData?.media || "PHYSICAL",
    platformId: initialData?.platformId
      ? String(initialData.platformId)
      : platformOptions[0]?.value || "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { mainPhotoUrl, additionalUrls } = await uploadImages();

    const payload = {
      gameId,
      media: formData.media,
      platformId: formData.platformId ? parseInt(formData.platformId) : undefined, // Adicione esta linha
      description: formData.description || undefined,
      status: formData.status,
      price: formData.price ? parseFloat(formData.price) : undefined,
      hasBox: formData.hasBox,
      hasManual: formData.hasManual,
      condition: formData.condition,
      acceptsTrade: formData.acceptsTrade,
      photoMain: mainPhotoUrl || undefined,
      photos: additionalUrls,
      progress: formData.progress ? parseFloat(formData.progress) : undefined,
      rating: formData.rating ? formData.rating : undefined,
      review: formData.review || undefined,
      abandoned: formData.abandoned,
    };

    if (mode === "create") {
      await createUserGame(payload);
    } else if (mode === "edit" && initialData?.id) {
      await updateUserGame({ id: initialData.id, data: payload });
    }

    onSuccess();
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

  const mediaOptions = [
    { value: "PHYSICAL", label: t("mediaPhysical") },
    { value: "DIGITAL", label: t("mediaDigital") },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            name="platformId"
            value={formData.platformId}
            onChange={handleChange}
            label={t("platform")}
            options={platformOptions}
          />

          <Select
            name="media"
            value={formData.media}
            onChange={handleChange}
            label={t("media")}
            options={mediaOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label={t("status")}
            options={statusOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Range
            label={t("progress")}
            value={Number(formData.progress)}
            onChange={(newValue) =>
              setFormData((prev) => ({ ...prev, progress: String(newValue) }))
            }
            min={0}
            max={10}
            step={0.5}
          />

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("rating")}
            </span>
            <Rating
              value={formData.rating}
              onChange={(newValue) => setFormData((prev) => ({ ...prev, rating: newValue }))}
              size="lg"
            />
          </div>
        </div>

        <Textarea
          name="review"
          value={formData.review}
          onChange={handleChange}
          label={t("review")}
          placeholder={t("reviewPlaceholder")}
          rows={4}
        />

        <Checkbox
          name="abandoned"
          checked={formData.abandoned}
          onChange={handleChange}
          label={t("abandoned")}
        />
      </div>

      <Collapse title={t("tradeSection")} defaultOpen={formData.status !== "OWNED"}>
        <TradeSection
          conditionOptions={conditionOptions}
          statusOptions={statusOptions}
          formData={formData}
          handleChange={handleChange}
          t={t}
          showPrice={true}
          showStatus={false}
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
          loading={isPending || uploadLoading}
          label={
            isPending || uploadLoading
              ? t("saving")
              : mode === "create"
                ? t("addToCollection")
                : t("saveChanges")
          }
        />
      </div>
    </form>
  );
};
