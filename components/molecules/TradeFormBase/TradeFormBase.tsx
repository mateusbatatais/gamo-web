// src/components/molecules/TradeFormBase/TradeFormBase.tsx
"use client";

import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { Select } from "@/components/atoms/Select/Select";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Radio } from "@/components/atoms/Radio/Radio";
import ImageCropper from "@/components/molecules/ImageCropper/ImageCropper";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { AdditionalImagesUpload } from "@/components/molecules/AdditionalImagesUpload/AdditionalImagesUpload";
import { MainImageUpload } from "@/components/molecules/MainImageUpload/MainImageUpload";

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

export function TradeFormBase<C extends string = string>({
  t: translate,
  initialData,
  onSubmit,
  onSuccess,
  onCancel,
  isSubmitting,
  conditionOptions,
  extraFields,
}: TradeFormBaseProps<C>) {
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
    };

    await onSubmit(payload);
    onSuccess();
  };

  const finalConditionOptions = conditionOptions?.length
    ? conditionOptions
    : defaultConditionOptions;

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

        {extraFields}

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            name="condition"
            value={formData.condition as unknown as string}
            onChange={handleChange}
            label={translate("condition")}
            options={finalConditionOptions}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translate("price")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                R$
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Checkbox
            name="hasBox"
            checked={formData.hasBox}
            onChange={handleChange}
            label={translate("hasBox")}
          />

          <Checkbox
            name="hasManual"
            checked={formData.hasManual}
            onChange={handleChange}
            label={translate("hasManual")}
          />

          <Checkbox
            name="acceptsTrade"
            checked={formData.acceptsTrade}
            onChange={handleChange}
            label={translate("acceptsTrade")}
          />
        </div>

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
