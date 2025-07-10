// components/atoms/Collapse/Collapse.tsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapseProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const Collapse = ({ title, defaultOpen = false, children }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && <div className="p-4 border-t bg-white dark:bg-gray-900">{children}</div>}
    </div>
  );
};
