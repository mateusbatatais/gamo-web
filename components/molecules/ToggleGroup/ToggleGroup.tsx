import React from "react";
import { Button, ButtonVariant, ButtonStatus } from "@/components/atoms/Button/Button";
import clsx from "clsx";

export type ToggleGroupSize = "sm" | "md" | "lg";
export type ToggleGroupVariant = ButtonVariant;
export type ToggleGroupStatus = ButtonStatus;

export interface ToggleGroupItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export interface ToggleGroupProps {
  items: ToggleGroupItem[];
  value: string;
  onChange: (value: string) => void;
  size?: ToggleGroupSize;
  variant?: ToggleGroupVariant;
  status?: ToggleGroupStatus;
  className?: string;
}

export function ToggleGroup({
  items,
  value,
  onChange,
  size = "md",
  variant = "primary",
  status = "default",
  className,
}: ToggleGroupProps) {
  return (
    <div className={clsx("inline-flex rounded-md shadow-sm", className)}>
      {items.map((item, index) => {
        const isSelected = value === item.value;
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <Button
            key={item.value}
            label={item.label}
            icon={item.icon}
            iconPosition={item.iconPosition}
            size={size}
            variant={variant}
            status={status}
            className={clsx("transition-all duration-200 !rounded-none", {
              "!rounded-l-md": isFirst,
              "!rounded-r-md": isLast,
              "-ml-px": !isFirst,
              "opacity-100": isSelected,
              "opacity-70 hover:opacity-100": !isSelected,
              "border-r-0": variant === "outline" && !isLast,
            })}
            onClick={() => onChange(item.value)}
          />
        );
      })}
    </div>
  );
}
