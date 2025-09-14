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

// Mapeamento de classes para variantes selecionadas
const selectedVariantClasses: Record<ButtonVariant, string> = {
  primary: "opacity-100 !cursor-default hover:!bg-primary-600",
  secondary: "opacity-100 !cursor-default hover:!bg-secondary-500",
  outline: "opacity-100 !cursor-default bg-primary-500 text-white border-primary-500",
  transparent: "opacity-100 !cursor-default bg-primary-500/20 text-primary-500",
};

// Mapeamento de classes para variantes não selecionadas
const unselectedVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-transparent !border-primary-500 text-primary-500 hover:bg-primary-500/10",
  secondary: "bg-transparent !border-secondary-500 text-secondary-500 hover:bg-secondary-500/10",
  outline: "bg-transparent !border-primary-500 text-primary-500 hover:bg-primary-500/10",
  transparent: "bg-transparent !border-primary-500 text-primary-500 hover:bg-primary-500/10",
};

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
            variant={isSelected ? variant : "outline"}
            status={isSelected ? status : "default"}
            className={clsx(
              "transition-all duration-200 !rounded-none",
              {
                "!rounded-l-md": isFirst,
                "!rounded-r-md": isLast,
                "-ml-px": !isFirst,
                "border-r-0": !isLast,
              },
              isSelected ? selectedVariantClasses[variant] : unselectedVariantClasses[variant],
            )}
            onClick={() => onChange(item.value)}
          />
        );
      })}
    </div>
  );
}
