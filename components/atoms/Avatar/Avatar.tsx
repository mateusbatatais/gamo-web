// components/atoms/Avatar/Avatar.tsx
import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { isValidUrl } from "@/utils/validate-url";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: React.ReactNode;
}

export const Avatar = ({ src, alt = "Avatar", size = "md", className, fallback }: AvatarProps) => {
  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const hasValidImage = src && isValidUrl(src);

  return (
    <div
      className={clsx(
        "relative rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300",
        sizeClasses[size],
        className,
      )}
    >
      {hasValidImage ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes={`${sizeClasses[size]}`} />
      ) : (
        fallback || (
          <span className="text-gray-400 text-lg">{alt ? alt.charAt(0).toUpperCase() : "U"}</span>
        )
      )}
    </div>
  );
};
