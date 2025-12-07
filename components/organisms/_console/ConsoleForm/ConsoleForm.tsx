// src/components/organisms/ConsoleForm/ConsoleForm.tsx
"use client";

import React, { ChangeEvent, useState, useEffect, useRef } from "react";
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
import { useAccount } from "@/hooks/account/useUserAccount";
import { useStorageOptions } from "@/hooks/useStorageOptions";
import { Select } from "@/components/atoms/Select/Select";
import { useAccessoryVariantsByConsole } from "@/hooks/useAccessoriesByConsole";
import { useUserAccessoryMutation } from "@/hooks/useUserAccessoryMutation";
import { AccessorySelector } from "@/components/molecules/AccessorySelector/AccessorySelector";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Radio } from "@/components/atoms/Radio/Radio";
import { CollectionStatus, Condition } from "@/@types/collection.types";
import { LocationData, LocationInput } from "@/components/molecules/LocationInput/LocationInput";
import { useUserGameMutation } from "@/hooks/useUserGameMutation";
import {
  GameSelector,
  SelectedGameVariant,
} from "@/components/molecules/GameSelector/GameSelector";
import useConsoleDetails from "@/hooks/useConsoleDetails";

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
    address?: string | null;
    zipCode?: string | null;
    city?: string | null;
    state?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  onSuccess: () => void;
  onCancel?: () => void;
  formId?: string;
  hideButtons?: boolean;
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
  formId,
  hideButtons = false,
}: ConsoleFormProps) => {
  const t = useTranslations("TradeForm");
  const { createUserConsole, updateUserConsole, isPending } = useUserConsoleMutation();
  const { createUserAccessory } = useUserAccessoryMutation();
  const { createUserGame } = useUserGameMutation();
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
      hasBox: !!initialData?.hasBox,
      hasManual: !!initialData?.hasManual,
      condition: initialData?.condition || "USED",
      acceptsTrade: !!initialData?.acceptsTrade,
    };
  });

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

  const { data: storageOptions, isLoading: storageOptionsLoading } =
    useStorageOptions(consoleVariantId);
  const { data: accessoryVariants, isLoading: accessoriesLoading } =
    useAccessoryVariantsByConsole(consoleId);
  const { data: consoleDetails } = useConsoleDetails(variantSlug, "pt");

  const [selectedStorageOptionId, setSelectedStorageOptionId] = useState<number | undefined>(
    initialData?.storageOptionId ?? undefined,
  );

  useEffect(() => {
    setSelectedStorageOptionId(initialData?.storageOptionId ?? undefined);
  }, [initialData?.storageOptionId]);

  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, SelectedAccessoryVariant>
  >({});

  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [selectedGameVariants, setSelectedGameVariants] = useState<
    Record<number, SelectedGameVariant>
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

  const addSelectedGames = async (userConsoleId: number) => {
    if (!isGamesOpen || !userConsoleId) return;
    for (const selected of Object.values(selectedGameVariants)) {
      if (selected.quantity <= 0) continue;

      for (let i = 0; i < selected.quantity; i++) {
        await createUserGame({
          gameId: selected.variantId,
          gameSlug: selected.slug,
          media: "PHYSICAL",
          status: formData.status || "OWNED",
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

  const handleGamesToggle = (open: boolean) => {
    setIsGamesOpen(open);
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
      address: locationData?.address || undefined,
      zipCode: locationData?.zipCode || undefined,
      city: locationData?.city || undefined,
      state: locationData?.state || undefined,
      latitude: locationData?.latitude || undefined,
      longitude: locationData?.longitude || undefined,
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
      await addSelectedGames(userConsoleId);
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
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
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

      <Collapse title={t("includeGames")} defaultOpen={false} onToggle={handleGamesToggle}>
        <GameSelector
          consoleId={consoleId}
          platformIds={consoleDetails?.platformIds}
          selectedVariants={selectedGameVariants}
          onQuantityChange={handleGameQuantityChange}
          onRemoveGame={handleRemoveGame}
          onAddGame={handleAddGame}
        />
      </Collapse>

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
            label={mode === "create" ? t("addToCollection") : t("saveChanges")}
          />
        </div>
      )}
    </form>
  );
};
