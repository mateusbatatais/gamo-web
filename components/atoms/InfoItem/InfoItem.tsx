// components/atoms/InfoItem/InfoItem.tsx
import React from "react";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export default function InfoItem({
  label,
  value,
  className = "",
  labelClassName = "",
  valueClassName = "",
}: InfoItemProps) {
  return (
    <div className={className}>
      <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${labelClassName}`}>
        {label}
      </dt>
      <dd className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${valueClassName}`}>
        {value || "-"}
      </dd>
    </div>
  );
}
