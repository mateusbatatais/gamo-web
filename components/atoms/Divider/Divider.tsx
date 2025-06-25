// src/components/atoms/Divider/Divider.tsx
import React from "react";

export const Divider = ({ label }: { label: string }) => (
  <div className="my-4 flex items-center">
    <hr className="flex-1 border-gray-300 dark:border-gray-700" />
    <span className="px-2 text-gray-500 text-sm dark:text-gray-400">{label}</span>
    <hr className="flex-1 border-gray-300 dark:border-gray-700" />
  </div>
);
