// src/components/organisms/GameForm/GameForm.tsx
"use client";

import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Select, SelectOption } from "@/components/atoms/Select/Select";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { AdditionalImagesUpload } from "@/components/molecules/AdditionalImagesUpload/AdditionalImagesUpload";
import { TradeSection } from "@/components/molecules/TradeSection/TradeSection";
import { MainImageUpload } from "@/components/molecules/MainImageUpload/MainImageUpload";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import { useAccount } from "@/hooks/account/useUserAccount";
import { Rating } from "@/components/atoms/Rating/Rating";
import { Range } from "@/components/atoms/Range/Range";
import { Radio } from "@/components/atoms/Radio/Radio";
import { SimpleCollapse } from "@/components/atoms/SimpleCollapse/SimpleCollapse";
import { CollectionStatus, Condition, MediaType } from "@/@types/collection.types";
import { LocationData, LocationInput } from "@/components/molecules/LocationInput/LocationInput";
import { ConsoleSelector } from "@/components/molecules/ConsoleSelector/ConsoleSelector";

interface GameFormProps {
  mode: "create" | "edit";
  type?: "collection" | "trade";
  gameId: number;
  gameSlug: string; // Adicionado
  platformOptions: SelectOption[];
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
    progress?: number | null;
    rating?: number | null;
    review?: string | null;
    abandoned?: boolean | null;
    media?: MediaType;
    platformId?: number;
    address?: string | null;
    zipCode?: string | null;
    city?: string | null;
    state?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    compatibleUserConsoleIds?: number[]; // Adicionado
  };
  onSuccess: () => void;
  onCancel?: () => void;
  formId?: string;
  hideButtons?: boolean;
}

export const GameForm = ({
  mode,
  type = "collection",
  gameId,
  gameSlug,
  platformOptions,
  initialData,
  onSuccess,
  onCancel,
  formId,
  hideButtons = false,
}: GameFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserGame, updateUserGame, isPending } = useUserGameMutation();
  const { profileQuery } = useAccount();
  const [showTrade, setShowTrade] = useState(false);
  const [keepCopyInCollection, setKeepCopyInCollection] = useState(false);

  const [locationData, setLocationData] = useState<LocationData | null>(() => {
    if (initialData?.address || initialData?.city) {
      return {
        formattedAddress: initialData.address || `${initialData.city}, ${initialData.state}`,
        address: initialData.address || "",
        zipCode: initialData.zipCode || "",
        city: initialData.city || "",
        state: initialData.state || "",
        latitude: initialData.latitude || 0,
        longitude: initialData.longitude || 0,
      };
    }
    return null;
  });

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

  const hasPrefilledLocation = useRef(false);

  useEffect(() => {
    if (hasPrefilledLocation.current) return;

    if (
      profileQuery.data &&
      !locationData &&
      (profileQuery.data.address || profileQuery.data.city)
    ) {
      setLocationData({
        formattedAddress:
          profileQuery.data.address || `${profileQuery.data.city}, ${profileQuery.data.state}`,
        address: profileQuery.data.address || "",
        zipCode: profileQuery.data.zipCode || "",
        city: profileQuery.data.city || "",
        state: profileQuery.data.state || "",
        latitude: profileQuery.data.latitude || 0,
        longitude: profileQuery.data.longitude || 0,
      });
      hasPrefilledLocation.current = true;
    }
  }, [profileQuery.data, locationData]);

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
    };
  });

  const [selectedConsoleIds, setSelectedConsoleIds] = useState<number[]>(
    initialData?.compatibleUserConsoleIds || [],
  );

  const [errors, setErrors] = useState<{
    price?: string;
    location?: string;
  }>({});

  useEffect(() => {
    if (formData.status !== "SELLING") {
      setKeepCopyInCollection(false);
    }
  }, [formData.status]);

  // Clear errors when form data changes
  useEffect(() => {
    setErrors({});
  }, [formData.price, locationData]);

  // Scroll to first error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      let elementId = "";

      if (firstErrorKey === "price") {
        elementId = "price-input";
      } else if (firstErrorKey === "location") {
        elementId = "location-input";
      }

      if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
    }
  }, [errors]);

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

    // Validação condicional baseada no status
    const validationErrors: { price?: string; location?: string } = {};

    if (formData.status === "SELLING") {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        validationErrors.price = t("priceRequired");
      }
      if (!locationData || !locationData.city) {
        validationErrors.location = t("locationRequired");
      }
    }

    if (formData.status === "LOOKING_FOR" && (!locationData || !locationData.city)) {
      validationErrors.location = t("locationRequired");
    }

    // Se houver erros, atualiza o estado e não submete
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { mainPhotoUrl, additionalUrls } = await uploadImages();

    const payload = {
      gameId,
      media: formData.media,
      platformId: formData.platformId ? parseInt(formData.platformId) : undefined,
      description: formData.description || undefined,
      status: formData.status || "OWNED",
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
      address: locationData?.address || undefined,
      zipCode: locationData?.zipCode || undefined,
      city: locationData?.city || undefined,
      state: locationData?.state || undefined,
      latitude: locationData?.latitude || undefined,
      longitude: locationData?.longitude || undefined,
      compatibleUserConsoleIds: selectedConsoleIds.length > 0 ? selectedConsoleIds : undefined,
    };

    if (mode === "create") {
      await createUserGame(payload);
    } else if (mode === "edit" && initialData?.id) {
      if (formData.status === "SELLING" && keepCopyInCollection && initialData.status === "OWNED") {
        const copyPayload = {
          ...payload,
          status: "PREVIOUSLY_OWNED" as const,
          price: undefined,
          acceptsTrade: false,
        };

        await createUserGame(copyPayload);
      }

      await updateUserGame({ id: initialData.id, data: payload });
    }

    onSuccess();
  };

  const conditionOptions = [
    { value: "NEW", label: t("conditionNew") },
    { value: "USED", label: t("conditionUsed") },
    { value: "REFURBISHED", label: t("conditionRefurbished") },
  ];

  const mediaOptions = [
    { value: "PHYSICAL", label: t("mediaPhysical") },
    { value: "DIGITAL", label: t("mediaDigital") },
  ];

  const handleRadioChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      {initialData?.status === "OWNED" && (
        <div className="space-y-3">
          <Checkbox
            label={t("putUpForSale", { item: t("game") })}
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
                {t("keepGameCopyInCollectionDescription")}
              </p>
            </div>
          )}
        </div>
      )}
      {initialData?.status === "LOOKING_FOR" && (
        <Checkbox
          label={t("moveToOwned", { item: t("game") })}
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
          label={t("moveToOwned", { item: t("game") })}
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

        <ConsoleSelector
          gameSlug={gameSlug}
          platformId={formData.platformId ? Number(formData.platformId) : undefined}
          selectedConsoleIds={selectedConsoleIds}
          onChange={setSelectedConsoleIds}
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
            priceError={errors.price}
          />

          {(formData.status === "SELLING" || formData.status === "LOOKING_FOR") && (
            <LocationInput
              label={t("location")}
              placeholder={t("locationPlaceholder")}
              value={locationData}
              onChange={setLocationData}
              data-testid="input-location"
              successMessage={t("locationSuccess")}
              errorMessage={errors.location}
            />
          )}

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
      {type === "trade" ? (
        <SimpleCollapse title="Progresso e analise" defaultOpen={false} childrenClass="space-y-6">
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

          {Number(formData.progress) !== 10 && (
            <Checkbox
              name="abandoned"
              checked={formData.abandoned}
              onChange={handleChange}
              label={t("abandoned")}
            />
          )}
        </SimpleCollapse>
      ) : (
        <>
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

          {Number(formData.progress) !== 10 && (
            <Checkbox
              name="abandoned"
              checked={formData.abandoned}
              onChange={handleChange}
              label={t("abandoned")}
            />
          )}
        </>
      )}
      {currentCropImage && (
        <ImageCropper
          src={currentCropImage.url}
          onBlobReady={handleCropComplete}
          onCancel={() => setCurrentCropImage(null)}
        />
      )}
      {!hideButtons && (
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
      )}
    </form>
  );
};
