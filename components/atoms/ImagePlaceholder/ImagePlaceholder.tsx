// components/atoms/ImagePlaceholder/ImagePlaceholder.tsx
import React from "react";
import { PLACEHOLDER_ICONS, PlaceholderType } from "@/constants/ui";

interface ImagePlaceholderProps {
  type: PlaceholderType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ImagePlaceholder = ({ type, size = "md", className = "" }: ImagePlaceholderProps) => {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800 ${className}`}
    >
      <span className={sizes[size]}>{PLACEHOLDER_ICONS[type]}</span>
    </div>
  );
};
