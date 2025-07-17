// components/molecules/ImagePreview/ImagePreview.tsx
"use client";

import { useRef, useState } from "react";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import Image from "next/image";
import ImageCropper from "../ImageCropper/ImageCropper";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/atoms/Badge/Badge";

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
  onCropComplete: (blob: Blob) => void;
  initialProcessed: boolean;
}

export function ImagePreview({
  src,
  onRemove,
  onCropComplete,
  initialProcessed,
}: ImagePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(initialProcessed);
  const hasBeenCropped = useRef(false);
  const t = useTranslations("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCrop = (blob: Blob) => {
    onCropComplete(blob);
    setIsEditing(false);
    setIsProcessed(true);
    hasBeenCropped.current = true;
  };

  const showBadge = !isProcessed && !hasBeenCropped.current;

  return (
    <div className="relative group" role="group" data-testid="image-preview">
      {showBadge && (
        <Badge
          variant="soft"
          status="warning"
          className="absolute z-10 top-1 left-1 text-[11px] !px-0.5 rounded-sm"
          data-testid="unprocessed-badge"
        >
          {t("common.notEdited")}
        </Badge>
      )}

      <div className="w-24 h-24 relative">
        <Image
          src={src}
          alt="Preview"
          fill
          className="object-cover rounded-md border"
          sizes="100px"
          data-testid="preview-image"
        />
      </div>

      <div
        className="absolute w-24 h-24 inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
        data-testid="action-overlay"
      >
        <Button
          variant="transparent"
          onClick={handleEditClick}
          className="!p-2"
          icon={<Edit size={16} className="text-white" />}
          data-testid="edit-button"
          aria-label="Edit image"
        />
        <Button
          variant="transparent"
          onClick={onRemove}
          className="!p-2"
          icon={<Trash2 size={16} className="text-white" />}
          data-testid="remove-button"
          aria-label="Remove image"
        />
      </div>

      {isEditing && (
        <ImageCropper
          src={src}
          onBlobReady={handleCrop}
          setFileSrc={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
