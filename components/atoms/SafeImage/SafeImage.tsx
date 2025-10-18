// components/atoms/SafeImage/SafeImage.tsx
"use client";

import React from "react";
import Image from "next/image";
import { isValidUrl, normalizeImageUrl } from "@/utils/validate-url";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export const SafeImage = ({
  src,
  alt,
  fill = true,
  sizes,
  className,
  priority = false,
}: SafeImageProps) => {
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400">
        <span className="text-4xl">🖥️</span>
      </div>
    );
  }

  if (isValidUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  const normalizedSrc = normalizeImageUrl(src);

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
};
