// components/molecules/SuccessCard/SuccessCard.tsx
import Link from "next/link";
import { Button } from "@/components/atoms/Button/Button";
import { ReactNode } from "react";

interface SuccessCardProps {
  title: string;
  message: string | ReactNode;
  buttonHref: string;
  buttonLabel: string;
  additionalContent?: ReactNode;
}

export function SuccessCard({
  title,
  message,
  buttonHref,
  buttonLabel,
  additionalContent,
}: SuccessCardProps) {
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h1>
      <div className="text-gray-600 dark:text-gray-300 mb-6">{message}</div>

      {additionalContent && <div className="mb-6">{additionalContent}</div>}

      <Link href={buttonHref}>
        <Button variant="primary" className="w-full" label={buttonLabel} />
      </Link>
    </div>
  );
}
