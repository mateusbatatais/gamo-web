// components/Button/Button.tsx
import React, { ReactNode } from "react";
import clsx from "clsx";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "outline" | "transparent";
export type ButtonStatus = "default" | "success" | "danger" | "warning" | "info";

export interface ButtonProps {
  label: string;
  title?: string;
  type?: "button" | "submit" | "reset";
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
  primary:
    "bg-primary text-white hover:bg-primary/90 dark:bg-primary-600 dark:hover:bg-primary-500",
  secondary:
    "bg-secondary text-white hover:bg-secondary/90 dark:bg-secondary-600 dark:hover:bg-secondary-500",
  outline:
    "border border-primary text-primary hover:bg-primary/10 dark:border-primary-600 dark:text-primary-200 dark:hover:bg-primary-800",
  transparent:
    "bg-transparent text-primary hover:bg-primary/10 dark:text-primary-200 dark:hover:bg-primary-800",
};

const statusClasses: Record<ButtonStatus, string> = {
  default: "",
  success: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400",
  danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400",
  warning:
    "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-300",
  info: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400",
};

export function Button({
  label,
  title,
  type,
  onClick,
  disabled = false,
  size = "md",
  variant = "primary",
  status = "default",
  icon,
  className,
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-md transition";
  const sizeCls = sizeClasses[size];
  const styleCls = status !== "default" ? statusClasses[status] : variantClasses[variant];
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        base,
        sizeCls,
        styleCls,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}
