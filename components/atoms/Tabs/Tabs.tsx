// components/atoms/Tabs/Tabs.tsx
"use client";

import React, { useState, ReactNode, Children, isValidElement, ReactElement } from "react";
import clsx from "clsx";
import { Button } from "../Button/Button";

export interface TabItemProps {
  label: string;
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

interface TabsProps {
  children: ReactElement<TabItemProps>[];
  defaultValue?: number;
  onChange?: (newValue: number) => void;
  fullWidth?: boolean;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
}

export const Tabs = ({
  children,
  defaultValue = 0,
  onChange,
  fullWidth = true,
  className,
  tabListClassName,
  tabClassName,
  contentClassName,
  activeTabClassName = "text-primary-600 !border-primary-500 rounded-none",
  inactiveTabClassName = "!text-neutral-600 hover:text-neutral-900 dark:!text-neutral-400 dark:hover:text-neutral-200 border-transparent",
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<number>(defaultValue);

  const handleChange = (newValue: number) => {
    setActiveTab(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={clsx("w-full", className)}>
      <div
        className={clsx(
          "flex border-b border-neutral-200 dark:border-neutral-700 mb-4",
          {
            "w-full": fullWidth,
          },
          tabListClassName,
        )}
        role="tablist"
      >
        {Children.map(children, (child, index) => {
          if (isValidElement<TabItemProps>(child)) {
            const isActive = activeTab === index;
            return (
              <Button
                key={index}
                variant="transparent"
                size="sm"
                aria-selected={isActive}
                aria-controls={`tabpanel-${index}`}
                disabled={child.props.disabled}
                className={clsx(
                  "border-b-2",
                  tabClassName,
                  isActive ? activeTabClassName : inactiveTabClassName,
                )}
                onClick={() => !child.props.disabled && handleChange(index)}
              >
                <div className="flex items-center justify-center gap-2">
                  {child.props.icon}
                  {child.props.label}
                </div>
              </Button>
            );
          }
          return null;
        })}
      </div>

      <div className={clsx("py-2", contentClassName)}>
        {Children.map(children, (child, index) => {
          if (isValidElement<TabItemProps>(child)) {
            const isActive = activeTab === index;
            return (
              <div
                key={index}
                id={`tabpanel-${index}`}
                role="tabpanel"
                aria-labelledby={`tab-${index}`}
                className={child.props.className}
                hidden={!isActive}
              >
                {isActive && child.props.children}
              </div>
            );
          }
          return child;
        })}
      </div>
    </div>
  );
};

export const TabItem = ({ children }: TabItemProps) => {
  return <>{children}</>;
};
