// components/molecules/AdditionalImagesUpload/AdditionalImagesUpload.tsx
"use client";

import React from "react";
import { Button } from "@/components/atoms/Button/Button";
import { ImagePreview } from "@/components/molecules/ImagePreview/ImagePreview";
import { Plus } from "lucide-react";

interface AdditionalImagesUploadProps {
  label: string;
  photos: { url: string; blob: Blob | null }[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onCropComplete: (blob: Blob, index: number) => void;
  t: (key: string) => string;
  maxPhotos?: number;
}

export const AdditionalImagesUpload = ({
  label,
  photos,
  fileInputRef,
  onImageUpload,
  onRemove,
  onCropComplete,
  t: translate,
  maxPhotos = 5,
}: AdditionalImagesUploadProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} ({photos.length}/{maxPhotos})
      </label>
      <div className="flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <ImagePreview
            key={index}
            src={photo.url}
            onRemove={() => onRemove(index)}
            onCropComplete={(blob) => onCropComplete(blob, index)}
            initialProcessed={!photo.blob}
          />
        ))}

        {photos.length < maxPhotos && (
          <Button
            variant="outline"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 flex flex-col items-center justify-center"
            icon={<Plus size={16} />}
          >
            {translate("addPhoto")}
          </Button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={onImageUpload}
      />
    </div>
  );
};
