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

// Função para extrair as iniciais do primeiro e último nome
const getInitials = (name: string): string => {
  if (!name) return "U";

  const names = name.trim().split(/\s+/);

  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  const firstName = names[0];
  const lastName = names[names.length - 1];

  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const Avatar = ({ src, alt = "Avatar", size = "md", className, fallback }: AvatarProps) => {
  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
    xl: "text-5xl",
  };

  const hasValidImage = src && isValidUrl(src);
  const initials = getInitials(alt);

  return (
    <div
      className={clsx(
        "relative rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300 border-4 border-white dark:border-gray-800 shadow-lg",
        sizeClasses[size],
        className,
      )}
    >
      {hasValidImage ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes={`${sizeClasses[size]}`} />
      ) : (
        fallback || (
          <span
            className={clsx("text-gray-400 dark:text-gray-300 font-medium", textSizeClasses[size])}
          >
            {initials}
          </span>
        )
      )}
    </div>
  );
};
