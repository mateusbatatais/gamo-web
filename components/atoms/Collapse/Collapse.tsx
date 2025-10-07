// components/atoms/Collapse/Collapse.tsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";

interface CollapseProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
}

export const Collapse = ({
  title,
  defaultOpen = false,
  children,
  onToggle,
  ...props
}: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <Card className="w-full !p-0 overflow-hidden" {...props}>
      <Button
        variant="transparent"
        className="w-full"
        onClick={toggle}
        iconPosition="right"
        icon={
          isOpen ? (
            <ChevronUp size={20} data-testid="chevron-up" />
          ) : (
            <ChevronDown size={20} data-testid="chevron-down" />
          )
        }
        label={title}
      />

      {isOpen && (
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">{children}</div>
      )}
    </Card>
  );
};
