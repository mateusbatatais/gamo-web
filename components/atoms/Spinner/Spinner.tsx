import React from "react";
import clsx from "clsx";
import { Loader2, Loader, RotateCw, RefreshCw, CircleDashed } from "lucide-react";

export type SpinnerVariant =
  | "default"
  | "loader"
  | "rotate"
  | "refresh"
  | "dashed"
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info";

export interface SpinnerProps {
  variant?: SpinnerVariant;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

const variantIcons: Record<SpinnerVariant, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  default: Loader2,
  loader: Loader,
  rotate: RotateCw,
  refresh: RefreshCw,
  dashed: CircleDashed,
  primary: Loader2,
  success: Loader2,
  danger: Loader2,
  warning: Loader2,
  info: Loader2,
};

const variantColors: Record<SpinnerVariant, string> = {
  default: "text-current",
  loader: "text-current",
  rotate: "text-current",
  refresh: "text-current",
  dashed: "text-current",
  primary: "text-primary dark:text-primary-400",
  success: "text-success dark:text-success-400",
  danger: "text-danger dark:text-danger-400",
  warning: "text-warning dark:text-warning-400",
  info: "text-info dark:text-info-400",
};

export function Spinner({
  variant = "default",
  className,
  size = 24,
  strokeWidth = 2,
}: SpinnerProps) {
  const Icon = variantIcons[variant];
  const colorClass = variantColors[variant];

  const spinnerClass = clsx("animate-spin", colorClass, className);

  return (
    <Icon
      className={spinnerClass}
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      aria-label="Carregando"
      role="status"
    />
  );
}
