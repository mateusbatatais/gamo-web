// components/atoms/Collapse/Collapse.tsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";

interface CollapseProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  onToggle?: (isOpen: boolean) => void; // Adicione esta linha
}

export const Collapse = ({ title, defaultOpen = false, children, onToggle }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <Card className="w-full !p-0 overflow-hidden">
      <Button
        variant="transparent"
        className="w-full "
        onClick={toggle}
        iconPosition="right"
        icon={isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        label={title}
      ></Button>

      {isOpen && (
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">{children}</div>
      )}
    </Card>
  );
};
