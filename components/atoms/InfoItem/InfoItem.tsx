// components/atoms/InfoItem/InfoItem.tsx
import React from "react";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || "-"}</dd>
    </div>
  );
}
