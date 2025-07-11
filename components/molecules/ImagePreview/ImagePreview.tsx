// components/molecules/ImagePreview/ImagePreview.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import Image from "next/image";
import ImageCropper from "../ImageCropper/ImageCropper";
import { useTranslations } from "next-intl";

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
  onCropComplete: (blob: Blob) => void;
}

export function ImagePreview({ src, onRemove, onCropComplete }: ImagePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [blobProcessed, setBlobProcessed] = useState(false);
  const initialSrc = useRef(src);
  const t = useTranslations("");

  useEffect(() => {
    setBlobProcessed(src !== initialSrc.current);
  }, [src]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCrop = (blob: Blob) => {
    onCropComplete(blob);
    setIsEditing(false);
    setBlobProcessed(true);
  };

  return (
    <div className="relative group">
      {!blobProcessed && (
        <span className="absolute z-10 top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
          {t("common.notEdited")}
        </span>
      )}
      <div className="w-24 h-24 relative">
        <Image
          src={src}
          alt="Preview"
          fill
          className="object-cover rounded-md border"
          sizes="100px"
        />
      </div>

      <div className="absolute w-24 h-24 inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
        <Button
          variant="transparent"
          onClick={handleEditClick}
          className="!p-2"
          icon={<Edit size={16} className="text-white" />}
        />
        <Button
          variant="transparent"
          onClick={onRemove}
          className="!p-2"
          icon={<Trash2 size={16} className="text-white" />}
        />
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4">
              <ImageCropper
                src={src}
                onBlobReady={handleCrop}
                setFileSrc={() => {}}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
