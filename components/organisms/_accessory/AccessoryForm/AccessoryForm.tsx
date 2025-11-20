"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { AdditionalImagesUpload } from "@/components/molecules/AdditionalImagesUpload/AdditionalImagesUpload";
import { TradeSection } from "@/components/molecules/TradeSection/TradeSection";
import { MainImageUpload } from "@/components/molecules/MainImageUpload/MainImageUpload";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { useUserConsoles } from "@/hooks/useUserConsoles";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Radio } from "@/components/atoms/Radio/Radio";
import { Spinner } from "@/components/atoms/Spinner/Spinner";
import { Condition, CollectionStatus } from "@/@types/collection.types";

interface AccessoryFormProps {
  mode: "create" | "edit";
  type?: "collection" | "trade";
  accessoryId: number;
  accessoryVariantId: number;
  accessorySlug: string;
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
    compatibleUserConsoleIds?: number[];
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const AccessoryForm = ({
  mode,
  type = "collection",
  accessoryId,
  accessoryVariantId,
  accessorySlug,
  initialData,
  onSuccess,
  onCancel,
}: AccessoryFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserAccessory, updateUserAccessory, isPending } = useUserAccessoryMutation();
  const { data: userConsoles, isLoading } = useUserConsoles(accessoryId);
  const [selectedConsoleIds, setSelectedConsoleIds] = useState<number[]>(
    initialData?.compatibleUserConsoleIds || [],
  );
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

  const handleCheckboxChange = (consoleId: number) => {
    setSelectedConsoleIds((prev) =>
      prev.includes(consoleId) ? prev.filter((id) => id !== consoleId) : [...prev, consoleId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { mainPhotoUrl, additionalUrls } = await uploadImages();

    const payload = {
      accessoryId,
      accessoryVariantId,
      accessorySlug,
      description: formData.description || undefined,
      status: formData.status || "OWNED",
      price: formData.price ? parseFloat(formData.price) : undefined,
      hasBox: formData.hasBox,
      hasManual: formData.hasManual,
      condition: formData.condition,
      acceptsTrade: formData.acceptsTrade,
      photoMain: mainPhotoUrl || undefined,
      photos: additionalUrls,
      compatibleUserConsoleIds: selectedConsoleIds,
    };

    if (mode === "create") {
      await createUserAccessory(payload);
    } else if (mode === "edit" && initialData?.id) {
      if (formData.status === "SELLING" && keepCopyInCollection && initialData.status === "OWNED") {
        const copyPayload = {
          ...payload,
          status: "PREVIOUSLY_OWNED" as const,
          price: undefined,
          acceptsTrade: false,
        };

        await createUserAccessory(copyPayload);
      }

      await updateUserAccessory({ id: initialData.id, data: payload });
    }

    onSuccess();
  };

  const conditionOptions = [
    { value: "NEW", label: t("conditionNew") },
    { value: "USED", label: t("conditionUsed") },
    { value: "REFURBISHED", label: t("conditionRefurbished") },
  ];

  const handleRadioChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {initialData?.status === "OWNED" && (
        <div className="space-y-3">
          <Checkbox
            label={t("putUpForSale", { item: t("accessory") })}
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
          label={t("moveToOwned", { item: t("accessory") })}
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
          label={t("moveToOwned", { item: t("accessory") })}
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

      <div className="mt-4">
        <h4 className="font-medium mb-2">{t("compatibleConsoles")}</h4>
        {isLoading ? (
          <Spinner />
        ) : userConsoles?.length === 0 ? (
          <p className="text-sm text-gray-500">{t("noConsoles")}</p>
        ) : (
          <div className="space-y-2">
            {userConsoles?.map((userConsole) => (
              <Checkbox
                key={userConsole.id}
                label={`${userConsole.name} (${t(userConsole.status)})`}
                checked={selectedConsoleIds.includes(userConsole.id || 0)}
                onChange={() => handleCheckboxChange(userConsole.id || 0)}
              />
            ))}
          </div>
        )}
      </div>
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
