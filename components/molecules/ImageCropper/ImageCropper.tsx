// components/ui/ImageCropper.tsx
"use client";

import { Button } from "@/components/atoms/Button/Button";
import { useTranslations } from "next-intl";
import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  src: string;
  aspect?: number;
  onBlobReady: (blob: Blob) => void;
  setFileSrc: (src: string | null) => void;
  onCancel?: () => void;
}

export default function ImageCropper({
  src,
  aspect = 1,
  onBlobReady,
  setFileSrc,
  onCancel,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();
  const t = useTranslations("");

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const initialCrop = centerCrop(
        makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
        width,
        height,
      );
      setCrop(initialCrop);
    },
    [aspect],
  );

  const handleCancel = () => {
    setFileSrc(null);
    onCancel?.();
  };

  const onCropComplete = useCallback((completed: PixelCrop) => {
    setPixelCrop(completed);
  }, []);

  const onConfirm = useCallback(() => {
    if (imgRef.current && pixelCrop) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        imgRef.current,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );
      canvas.toBlob(
        (blob) => {
          if (blob) onBlobReady(blob);
        },
        "image/jpeg",
        0.9,
      );
    }
  }, [onBlobReady, pixelCrop]);

  return (
    <div className="space-y-4" data-testid="image-cropper">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={onCropComplete}
        aspect={aspect}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt="Crop preview"
          src={src}
          onLoad={onImageLoad}
          className="max-w-full"
        />
      </ReactCrop>
      <div className="mt-6 gap-3 flex justify-end">
        <Button
          variant="transparent"
          status="danger"
          onClick={handleCancel}
          label={t("crop.cancelCrop")}
        />
        <Button
          onClick={onConfirm}
          label={t("crop.confirmCrop")}
          data-testid="button-crop-confirm"
        ></Button>
      </div>
    </div>
  );
}
