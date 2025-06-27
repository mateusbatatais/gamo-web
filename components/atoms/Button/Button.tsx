import React, { ReactNode } from "react";
import clsx from "clsx";

export type ButtonSize = "sm" | "md" | "lg" | "xl";
export type ButtonVariant = "primary" | "secondary" | "outline" | "transparent";
export type ButtonStatus = "default" | "success" | "danger" | "warning" | "info";

export interface ButtonProps {
  label?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children?: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
  xl: "px-6 py-3.5 text-xl",
};

// Classes base para cada variante
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 border border-transparent",
  secondary:
    "bg-secondary text-white hover:bg-secondary-600 dark:bg-secondary-600 dark:hover:bg-secondary-500 border border-transparent",
  outline: "border bg-transparent",
  transparent: "bg-transparent border-transparent",
};

// Classes para status - agora focam apenas na cor do texto e borda
const statusColorClasses: Record<ButtonStatus, string> = {
  default: "text-primary border-primary hover:bg-primary/10",
  success: "text-success border-success hover:bg-success/10",
  danger: "text-danger border-danger hover:bg-danger/10",
  warning: "text-warning border-warning hover:bg-warning/10",
  info: "text-info border-info hover:bg-info/10",
};

// Classes para variantes sólidas (que usam background)
const solidStatusClasses: Record<ButtonStatus, string> = {
  default: "bg-primary text-white hover:bg-primary-600",
  success: "bg-success text-white hover:bg-success-600",
  danger: "bg-danger text-white hover:bg-danger-600",
  warning: "bg-warning text-white hover:bg-warning-600",
  info: "bg-info text-white hover:bg-info-600",
};

export function Button({
  label,
  title,
  type = "button",
  onClick,
  disabled = false,
  size = "md",
  variant = "primary",
  status = "default",
  icon,
  iconPosition = "left",
  className,
  children,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 cursor-pointer";

  const sizeCls = sizeClasses[size];
  const variantCls = variantClasses[variant];

  // Determina as classes de cor baseado na variante e status
  let colorCls = "";
  if (variant === "outline" || variant === "transparent") {
    colorCls = statusColorClasses[status];
  } else {
    colorCls = solidStatusClasses[status];
  }

  const iconSpacing = icon ? (iconPosition === "right" ? "ml-2" : "mr-2") : "";
  const content = children || label;

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        base,
        sizeCls,
        variantCls,
        colorCls,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {icon && iconPosition === "left" && <span className={iconSpacing}>{icon}</span>}
      {content}
      {icon && iconPosition === "right" && <span className={iconSpacing}>{icon}</span>}
    </button>
  );
}
