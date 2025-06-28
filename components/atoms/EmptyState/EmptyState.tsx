import React from "react";
import clsx from "clsx";
import { Button, ButtonProps } from "../Button/Button";

export type EmptyStateSize = "sm" | "md" | "lg";
export type EmptyStateVariant = "default" | "simple" | "card";

export interface EmptyStateProps {
  title: string;
  description: string | React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  actionVariant?: ButtonProps["variant"];
  actionStatus?: ButtonProps["status"];
  icon?: React.ReactNode;
  size?: EmptyStateSize;
  variant?: EmptyStateVariant;
  className?: string;
}

const sizeClasses: Record<EmptyStateSize, string> = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
};

const variantClasses: Record<EmptyStateVariant, string> = {
  default: "bg-transparent",
  simple: "bg-gray-50 dark:bg-gray-800/50 rounded-xl",
  card: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm",
};

function EmptyStateIcon({ icon, size }: { icon?: React.ReactNode; size: EmptyStateSize }) {
  if (icon) {
    return (
      <div className={clsx("mb-4", size === "sm" ? "scale-90" : size === "lg" ? "scale-110" : "")}>
        {icon}
      </div>
    );
  }
  return (
    <div
      className={clsx(
        "mb-4 rounded-full p-3",
        "bg-gray-100 dark:bg-gray-800",
        size === "sm" ? "p-2" : size === "lg" ? "p-4" : "",
      )}
      data-testid="default-icon-container"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(
          size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-12 w-12",
          "text-gray-400 dark:text-gray-500",
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        data-testid="default-svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

function EmptyStateAction({
  actionText,
  onAction,
  actionVariant,
  actionStatus,
  size,
}: {
  actionText?: string;
  onAction?: () => void;
  actionVariant: ButtonProps["variant"];
  actionStatus: ButtonProps["status"];
  size: EmptyStateSize;
}) {
  if (!actionText || !onAction) return null;
  return (
    <div className="mt-6">
      <Button
        onClick={onAction}
        label={actionText}
        variant={actionVariant}
        status={actionStatus}
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
      />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon,
  size = "md",
  variant = "default",
  actionVariant = "primary",
  actionStatus = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      data-testid="empty-state-container"
    >
      <EmptyStateIcon icon={icon} size={size} />

      <h3
        className={clsx(
          "font-semibold",
          size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl",
          "text-gray-900 dark:text-white",
        )}
      >
        {title}
      </h3>

      <p
        className={clsx(
          "mt-2 max-w-md",
          size === "sm" ? "text-sm" : "text-base",
          "text-gray-600 dark:text-gray-400",
        )}
      >
        {description}
      </p>

      <EmptyStateAction
        actionText={actionText}
        onAction={onAction}
        actionVariant={actionVariant}
        actionStatus={actionStatus}
        size={size}
      />
    </div>
  );
}
