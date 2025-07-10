// components/molecules/ImagePreview/ImagePreview.tsx
"use client";

import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import Image from "next/image";
import ImageCropper from "../ImageCropper/ImageCropper";

interface ImagePreviewProps {
  src: string;
  onRemove: () => void;
  onCropComplete: (blob: Blob) => void;
}

export function ImagePreview({ src, onRemove, onCropComplete }: ImagePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="relative group">
      <div className="w-24 h-24 relative">
        <Image
          src={src}
          alt="Preview"
          fill
          className="object-cover rounded-md border"
          sizes="100px"
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
        <Button
          variant="transparent"
          onClick={handleEditClick}
          icon={<Edit size={16} className="text-white" />}
        />
        <Button
          variant="transparent"
          onClick={onRemove}
          icon={<Trash2 size={16} className="text-white" />}
        />
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4">
              <ImageCropper
                src={src}
                onBlobReady={(blob) => {
                  onCropComplete(blob);
                  setIsEditing(false);
                }}
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
