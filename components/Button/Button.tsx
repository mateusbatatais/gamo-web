import React, { ReactNode } from "react";
import clsx from "clsx";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "outline" | "transparent";
export type ButtonStatus =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "info";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  icon?: ReactNode;
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-white hover:bg-secondary/90",
  outline: "border border-primary text-primary hover:bg-primary/10",
  transparent: "bg-transparent text-primary hover:bg-primary/10",
};

const statusClasses: Record<ButtonStatus, string> = {
  default: "",
  success: "bg-success text-white hover:bg-success/90",
  danger: "bg-danger text-white hover:bg-danger/90",
  warning: "bg-warning text-white hover:bg-warning/90",
  info: "bg-info text-white hover:bg-info/90",
};

export function Button({
  label,
  onClick,
  disabled = false,
  size = "md",
  variant = "primary",
  status = "default",
  icon,
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition";
  const sizeCls = sizeClasses[size];
  const styleCls =
    status !== "default" ? statusClasses[status] : variantClasses[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        base,
        sizeCls,
        styleCls,
        icon && label && "gap-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {icon}
      {label}
    </button>
  );
}
