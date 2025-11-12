"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SimpleCollapseProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  childrenClass?: string;
}

export const SimpleCollapse = ({
  title,
  children,
  defaultOpen = false,
  childrenClass,
}: SimpleCollapseProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-gray-200 dark:border-gray-700`}>
      <button
        type="button"
        className="flex cursor-pointer items-center justify-between w-full py-3 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className={`pb-3 px-2 ${childrenClass}`}>{children}</div>}
    </div>
  );
};
