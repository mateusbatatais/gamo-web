// src/components/molecules/TradeFormBase/TradeFormBase.tsx
"use client";

import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Radio } from "@/components/atoms/Radio/Radio";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { AdditionalImagesUpload } from "@/components/molecules/AdditionalImagesUpload/AdditionalImagesUpload";
import { MainImageUpload } from "@/components/molecules/MainImageUpload/MainImageUpload";
import { TradeSection } from "@/components/molecules/TradeSection/TradeSection";
import { useAccount } from "@/hooks/account/useUserAccount";
import { LocationData, LocationInput } from "@/components/molecules/LocationInput/LocationInput";

export type StatusType = "SELLING" | "LOOKING_FOR";

export interface TradeInitialData<C extends string = string> {
  id?: number;
  description?: string | null;
  status?: StatusType;
  price?: number | null;
  hasBox?: boolean | null;
  hasManual?: boolean | null;
  condition?: C | null;
  acceptsTrade?: boolean | null;
  photoMain?: string | null;
  photos?: string[] | null;
  address?: string | null;
  zipCode?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface TradeSubmitData<C extends string = string> {
  description?: string;
  status: StatusType;
  price?: number;
  hasBox: boolean;
  hasManual: boolean;
  condition: C;
  acceptsTrade: boolean;
  photoMain?: string;
  photos: string[];
  platformId?: number;
  address?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export interface TradeFormBaseProps<C extends string = string> {
  t: (key: string) => string;
  initialData?: TradeInitialData<C>;
  onSubmit: (data: TradeSubmitData<C>) => Promise<void>;
  onSuccess: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  conditionOptions?: { value: C; label: string }[];
  extraFields?: React.ReactNode;
  showLocation?: boolean;
}

interface FormDataType<C extends string = string> {
  description: string;
  status: StatusType;
  price: string;
  hasBox: boolean;
  hasManual: boolean;
  condition: C;
  acceptsTrade: boolean;
}

interface TradeSectionData {
  condition: string;
  price: string;
  acceptsTrade: boolean;
  hasBox: boolean;
  hasManual: boolean;
}

export function TradeFormBase<C extends string = string>({
  t: translate,
  initialData,
  onSubmit,
  onSuccess,
  onCancel,
  isSubmitting,
  conditionOptions,
  extraFields,
  showLocation = true,
}: TradeFormBaseProps<C>) {
  const { profileQuery } = useAccount();
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

  const [formData, setFormData] = useState<FormDataType<C>>({
    description: initialData?.description ?? "",
    status: initialData?.status || "SELLING",
    price: initialData?.price ? String(initialData.price) : "",
    hasBox: initialData?.hasBox ?? false,
    hasManual: initialData?.hasManual ?? false,
    condition: (initialData?.condition ?? ("USED" as unknown as C)) as C,
    acceptsTrade: initialData?.acceptsTrade ?? false,
  });

  const [errors, setErrors] = useState<{
    price?: string;
    location?: string;
  }>({});

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
      [name]: type === "checkbox" ? checked : (value as unknown as C),
    }));
  };

  const handleRadioChange = (name: keyof FormDataType<C>, value: StatusType) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value as unknown as C & StatusType,
    }));
  };

  const isLoading = Boolean(isSubmitting) || uploadLoading;

  const defaultConditionOptions: { value: C; label: string }[] = [
    { value: "NEW", label: translate("conditionNew") },
    { value: "USED", label: translate("conditionUsed") },
    { value: "REFURBISHED", label: translate("conditionRefurbished") },
  ] as unknown as { value: C; label: string }[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação condicional baseada no status
    const validationErrors: { price?: string; location?: string } = {};

    if (formData.status === "SELLING") {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        validationErrors.price = translate("priceRequired");
      }
      if (showLocation && (!locationData || !locationData.city)) {
        validationErrors.location = translate("locationRequired");
      }
    }

    if (
      formData.status === "LOOKING_FOR" &&
      showLocation &&
      (!locationData || !locationData.city)
    ) {
      validationErrors.location = translate("locationRequired");
    }

    // Se houver erros, atualiza o estado e não submete
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { mainPhotoUrl, additionalUrls } = await uploadImages();

    const payload: TradeSubmitData<C> = {
      description: formData.description || undefined,
      status: formData.status,
      price: formData.price ? parseFloat(formData.price) : undefined,
      hasBox: formData.hasBox,
      hasManual: formData.hasManual,
      condition: formData.condition,
      acceptsTrade: formData.acceptsTrade,
      photoMain: mainPhotoUrl || undefined,
      photos: additionalUrls,
      address: locationData?.address || undefined,
      zipCode: locationData?.zipCode || undefined,
      city: locationData?.city || undefined,
      state: locationData?.state || undefined,
      latitude: locationData?.latitude || undefined,
      longitude: locationData?.longitude || undefined,
    };

    await onSubmit(payload);
    onSuccess();
  };

  const finalConditionOptions = conditionOptions?.length
    ? conditionOptions
    : defaultConditionOptions;

  const tradeSectionData: TradeSectionData = {
    condition: formData.condition as string,
    price: formData.price,
    acceptsTrade: formData.acceptsTrade,
    hasBox: formData.hasBox,
    hasManual: formData.hasManual,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex space-x-4">
            <Radio
              name="status"
              value="SELLING"
              checked={formData.status === "SELLING"}
              onChange={() => handleRadioChange("status", "SELLING")}
              label={translate("statusSelling")}
            />
            <Radio
              name="status"
              value="LOOKING_FOR"
              checked={formData.status === "LOOKING_FOR"}
              onChange={() => handleRadioChange("status", "LOOKING_FOR")}
              label={translate("statusLookingFor")}
            />
          </div>
        </div>

        <MainImageUpload
          label={translate("mainPhoto")}
          photo={photoMain}
          fileInputRef={mainFileInputRef}
          onImageUpload={(e) => handleImageUpload(e, "main")}
          onRemove={() => removeImage("main")}
          onCropComplete={(blob) => {
            const url = URL.createObjectURL(blob);
            setPhotoMain({ url, blob });
          }}
          t={translate}
        />

        <TradeSection
          conditionOptions={finalConditionOptions as { value: string; label: string }[]}
          formData={tradeSectionData}
          handleChange={
            handleChange as (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
          }
          t={translate}
          showPrice={true}
          priceError={errors.price}
        />

        {showLocation && (formData.status === "SELLING" || formData.status === "LOOKING_FOR") && (
          <LocationInput
            label={translate("location")}
            placeholder={translate("locationPlaceholder")}
            value={locationData}
            onChange={setLocationData}
            data-testid="input-location"
            successMessage={translate("locationSuccess")}
            errorMessage={errors.location}
          />
        )}

        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          label={translate("description")}
          placeholder={translate("descriptionPlaceholder")}
          rows={4}
        />

        <AdditionalImagesUpload
          label={translate("additionalPhotos")}
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
          t={translate}
        />
      </div>

      {currentCropImage && (
        <ImageCropper
          src={currentCropImage.url}
          onBlobReady={handleCropComplete}
          onCancel={() => setCurrentCropImage(null)}
        />
      )}

      {extraFields}

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} label={translate("cancel")} />
        <Button
          type="submit"
          loading={isLoading}
          label={
            isLoading
              ? translate("saving")
              : initialData?.id
                ? translate("saveChanges")
                : translate("publish")
          }
        />
      </div>
    </form>
  );
}

export default TradeFormBase;
