// components/atoms/ImageWithLoading/ImageWithLoading.tsx
"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import clsx from "clsx";
import { SPINNER_SIZES, SpinnerSize } from "@/constants/ui";

interface ImageWithLoadingProps extends Omit<ImageProps, "onLoad" | "onError" | "alt"> {
  alt: string; // Make alt required to satisfy ESLint
  spinnerSize?: SpinnerSize;
  onLoadComplete?: () => void;
  onErrorOccurred?: () => void;
  showSpinner?: boolean;
}

export const ImageWithLoading = ({
  alt,
  spinnerSize = "card",
  onLoadComplete,
  onErrorOccurred,
  showSpinner = true,
  className,
  ...imageProps
}: ImageWithLoadingProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    onErrorOccurred?.();
  };

  return (
    <>
      {isLoading && showSpinner && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div
            className={clsx(
              SPINNER_SIZES[spinnerSize],
              "border-4 border-gray-300 dark:border-gray-600 border-t-primary-500 rounded-full animate-spin",
            )}
          />
        </div>
      )}
      <Image
        {...imageProps}
        alt={alt}
        className={clsx(
          className,
          "transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
};
