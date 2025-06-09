// components/ui/ImageCropper.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  src: string;
  aspect?: number;
  onBlobReady: (blob: Blob) => void;
}

export default function ImageCropper({ src, aspect = 1, onBlobReady }: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [pixelCrop, setPixelCrop] = useState<PixelCrop>();

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
    <div className="space-y-4">
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
          className="max-w-full max-h-96"
        />
      </ReactCrop>
      <button
        onClick={onConfirm}
        className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
      >
        Confirmar crop
      </button>
    </div>
  );
}
