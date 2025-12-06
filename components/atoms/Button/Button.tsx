// components/atoms/Button/Button.tsx
import React, { ReactNode, Suspense } from "react";
import clsx from "clsx";

// Importa o Spinner de forma dinâmica para evitar problemas de importação circular e resolver problemas de testes
const Spinner = React.lazy(() =>
  import("../Spinner/Spinner").then((module) => ({ default: module.Spinner })),
);

export type ButtonSize = "sm" | "md" | "lg" | "xl";
export type ButtonVariant = "primary" | "secondary" | "outline" | "transparent";
export type ButtonStatus = "default" | "success" | "danger" | "warning" | "info";

export interface ButtonProps {
  label?: string;
  title?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  status?: ButtonStatus;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children?: ReactNode;
  form?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
  xl: "px-6 py-4.5 text-xl",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white border border-transparent",
  secondary: "bg-secondary-500 text-white border border-transparent hover:bg-secondary-600",
  outline: "border bg-transparent",
  transparent: "bg-transparent border-transparent",
};

const statusColorClasses: Record<ButtonStatus, string> = {
  default: "text-primary-500 border-primary-500 hover:bg-primary-500/10",
  success: "text-success-500 border-success-500 hover:bg-success-500/10",
  danger: "text-danger-500 border-danger-500 hover:bg-danger-500/10",
  warning: "text-warning-500 border-warning-500 hover:bg-warning-500/10",
  info: "text-info-500 border-info-500 hover:bg-info-500/10",
};

const solidStatusClasses: Record<ButtonStatus, string> = {
  default: "bg-primary-500 text-white hover:bg-primary-600",
  success: "bg-success-500 text-white hover:bg-success-600",
  danger: "bg-danger-500 text-white hover:bg-danger-600",
  warning: "bg-warning-500 text-white hover:bg-warning-600",
  info: "bg-info-500 text-white hover:bg-info-600",
};

export function Button({
  label,
  title,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  size = "md",
  variant = "primary",
  status = "default",
  icon,
  iconPosition = "left",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded transition-colors cursor-pointer gap-2 leading-none";

  const sizeCls = sizeClasses[size];
  const variantCls = variantClasses[variant];

  let colorCls = "";
  if (variant === "outline" || variant === "transparent") {
    colorCls = statusColorClasses[status];
  } else {
    colorCls = solidStatusClasses[status];
  }

  const content = children || label;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={clsx(
        base,
        sizeCls,
        variantCls,
        colorCls,
        {
          "opacity-50 cursor-not-allowed": disabled || loading,
          "animate-pulse": loading,
        },
        className,
      )}
      {...props}
    >
      {loading ? (
        <Suspense fallback={null}>
          <Spinner />
        </Suspense>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
          {content && <span>{content}</span>}
          {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}
