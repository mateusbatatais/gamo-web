// components/molecules/MainImageUpload/MainImageUpload.tsx
"use client";

import React from "react";
import { Button } from "@/components/atoms/Button/Button";
import { ImagePreview } from "@/components/molecules/ImagePreview/ImagePreview";
import { Plus } from "lucide-react";

interface MainImageUploadProps {
  label: string;
  photo: { url: string; blob: Blob | null } | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onCropComplete: (blob: Blob) => void;
  t: (key: string) => string;
}

export const MainImageUpload = ({
  label,
  photo,
  fileInputRef,
  onImageUpload,
  onRemove,
  onCropComplete,
  t,
}: MainImageUploadProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {photo ? (
        <ImagePreview
          src={photo.url}
          onRemove={onRemove}
          onCropComplete={onCropComplete}
          initialProcessed={true}
        />
      ) : (
        <Button
          variant="outline"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 flex flex-col items-center justify-center"
          icon={<Plus size={16} />}
          label={t("addPhoto")}
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onImageUpload}
      />
    </div>
  );
};
