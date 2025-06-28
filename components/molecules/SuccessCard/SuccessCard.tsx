import Link from "next/link";
import { Button, ButtonVariant, ButtonStatus } from "@/components/atoms/Button/Button";
import { ReactNode } from "react";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";

export type CardStatus = "success" | "info" | "warning" | "danger" | "default";

export interface SuccessCardProps {
  title: string;
  message: string | ReactNode;
  buttonHref: string;
  buttonLabel: string;
  status?: CardStatus;
  buttonVariant?: ButtonVariant;
  buttonStatus?: ButtonStatus;
  icon?: ReactNode;
  additionalContent?: ReactNode;
  className?: string;
}

const statusClasses: Record<CardStatus, string> = {
  success: "text-success dark:text-success-400",
  info: "text-info dark:text-info-400",
  warning: "text-warning dark:text-warning-400",
  danger: "text-danger dark:text-danger-400",
  default: "text-primary dark:text-primary-400",
};

const containerClasses =
  "max-w-md mx-auto p-6 text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg";

export function SuccessCard({
  title,
  message,
  buttonHref,
  buttonLabel,
  status = "success",
  buttonVariant = "primary",
  buttonStatus,
  icon,
  additionalContent,
  className,
}: SuccessCardProps) {
  const IconComponent = icon || (
    <CheckCircle className="w-16 h-16 mx-auto mb-4" aria-hidden="true" />
  );

  return (
    <div className={clsx(containerClasses, className)} data-testid="success-card">
      <div className={clsx("flex justify-center mb-4", statusClasses[status])}>{IconComponent}</div>

      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h1>

      <div className="text-gray-600 dark:text-gray-300 mb-6">{message}</div>

      {additionalContent && <div className="mb-6">{additionalContent}</div>}

      <Link href={buttonHref} className="block">
        <Button
          variant={buttonVariant}
          status={buttonStatus || status}
          className="w-full"
          label={buttonLabel}
        />
      </Link>
    </div>
  );
}
