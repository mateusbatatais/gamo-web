// components/atoms/ImageWithFallback/ImageWithFallback.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  packageSize?: number;
  fallbackClassName?: string;
  sizes?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
}

export const ImageWithFallback = ({
  src,
  alt,
  packageSize = 32,
  fallbackClassName = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  imgClassName = "object-cover",
  width,
  height,
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);

  if (src && !error) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={!width || !height}
        width={width}
        height={height}
        className={imgClassName}
        onError={() => setError(true)}
        sizes={sizes}
        unoptimized
      />
    );
  }

  return (
    <div className={fallbackClassName}>
      <Package size={packageSize} className="text-gray-400 dark:text-gray-500" />
    </div>
  );
};
