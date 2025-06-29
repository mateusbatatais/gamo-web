// components/atoms/Skeleton/Skeleton.tsx
import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  animated?: boolean;
}

export function Skeleton({ className, rounded = "md", animated = true }: SkeletonProps) {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      className={clsx(
        "bg-gray-200 dark:bg-gray-700",
        roundedClasses[rounded],
        animated && "animate-pulse",
        className,
      )}
    />
  );
}
