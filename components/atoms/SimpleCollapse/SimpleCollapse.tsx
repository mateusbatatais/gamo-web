// components/atoms/SimpleCollapse/SimpleCollapse.tsx
"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SimpleCollapseProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  childrenClass?: string;
}

export const SimpleCollapse = ({
  title,
  children,
  isOpen,
  onToggle,
  childrenClass,
}: SimpleCollapseProps) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700`}>
      <button
        type="button"
        className="flex cursor-pointer items-center justify-between w-full py-3 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded-md"
        onClick={onToggle}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className={`pb-3 px-2 ${childrenClass}`}>{children}</div>}
    </div>
  );
};
