// components/Account/ProfileImagePlaceholder.tsx
import React from "react";
import { Joystick } from "lucide-react";
import clsx from "clsx";

interface ProfileImagePlaceholderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ProfileImagePlaceholder({
  size = "md",
  className,
}: ProfileImagePlaceholderProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  return (
    <div
      className={clsx(
        "bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden",
        sizeClasses[size],
        className,
      )}
    >
      <Joystick size={iconSizes[size]} className="text-primary-500 dark:text-primary-400" />
    </div>
  );
}
