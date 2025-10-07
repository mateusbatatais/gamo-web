import React from "react";
import clsx from "clsx";

export type BadgeSize = "sm" | "md" | "lg";
export type BadgeVariant = "solid" | "outline" | "soft";
export type BadgeStatus =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

export interface BadgeProps {
  size?: BadgeSize;
  variant?: BadgeVariant;
  status?: BadgeStatus;
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-0.5",
  lg: "text-base px-3 py-1",
};

const variantClasses: Record<BadgeVariant, Record<BadgeStatus, string>> = {
  solid: {
    default: "bg-gray-800 text-white dark:bg-gray-300 dark:text-gray-800",
    primary: "bg-primary text-white dark:bg-primary-400 dark:text-white",
    secondary: "bg-secondary text-white dark:bg-secondary-400 dark:text-white",
    success: "bg-success text-white dark:bg-success-400 dark:text-white",
    danger: "bg-danger text-white dark:bg-danger-400 dark:text-white",
    warning: "bg-warning text-white dark:bg-warning-400 dark:text-gray-900",
    info: "bg-info text-white dark:bg-info-400 dark:text-white",
  },
  outline: {
    default: "border border-gray-800 text-gray-800 dark:border-gray-300 dark:text-gray-300",
    primary: "border border-primary text-primary dark:border-primary-400 dark:text-primary-400",
    secondary:
      "border border-secondary text-secondary dark:border-secondary-400 dark:text-secondary-400",
    success: "border border-success text-success dark:border-success-400 dark:text-success-400",
    danger: "border border-danger text-danger dark:border-danger-400 dark:text-danger-400",
    warning: "border border-warning text-warning dark:border-warning-400 dark:text-warning-400",
    info: "border border-info text-info dark:border-info-400 dark:text-info-400",
  },
  soft: {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
    secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200",
    success: "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200",
    danger: "bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200",
    warning: "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200",
    info: "bg-info-100 text-info-800 dark:bg-info-900 dark:text-info-200",
  },
};

export function Badge({
  size = "md",
  variant = "solid",
  status = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  const base = "inline-flex items-center rounded-full font-medium transition-colors";

  return (
    <span
      className={clsx(base, sizeClasses[size], variantClasses[variant][status], className)}
      {...props}
    >
      {children}
    </span>
  );
}
