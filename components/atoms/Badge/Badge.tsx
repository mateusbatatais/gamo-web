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
    default: "bg-gray-800 text-white",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    danger: "bg-danger text-white",
    warning: "bg-warning text-white",
    info: "bg-info text-white",
  },
  outline: {
    default: "border border-gray-800 text-gray-800",
    primary: "border border-primary text-primary",
    secondary: "border border-secondary text-secondary",
    success: "border border-success text-success",
    danger: "border border-danger text-danger",
    warning: "border border-warning text-warning",
    info: "border border-info text-info",
  },
  soft: {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-success-100 text-success-800",
    danger: "bg-danger-100 text-danger-800",
    warning: "bg-warning-100 text-warning-800",
    info: "bg-info-100 text-info-800",
  },
};

export function Badge({
  size = "md",
  variant = "solid",
  status = "default",
  className,
  children,
}: BadgeProps) {
  const base = "inline-flex items-center rounded-full font-medium";

  return (
    <span className={clsx(base, sizeClasses[size], variantClasses[variant][status], className)}>
      {children}
    </span>
  );
}
