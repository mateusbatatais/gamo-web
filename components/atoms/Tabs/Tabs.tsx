// components/atoms/Tabs/Tabs.tsx
"use client";

import React, { useState, ReactNode, Children, isValidElement, ReactElement } from "react";
import clsx from "clsx";

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
  activeTabClassName = "text-primary-600 dark:text-primary-400 font-semibold border-b-2 border-primary-500",
  inactiveTabClassName = "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600",
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
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${index}`}
                disabled={child.props.disabled}
                className={clsx(
                  "px-4 py-2 transition-colors duration-200 cursor-pointer",
                  tabClassName,
                  isActive ? activeTabClassName : inactiveTabClassName,
                  child.props.disabled && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !child.props.disabled && handleChange(index)}
              >
                <div className="flex items-center justify-center gap-2">
                  {child.props.icon}
                  {child.props.label}
                </div>
              </button>
            );
          }
          return null;
        })}
      </div>

      <div className={clsx(contentClassName)}>
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
