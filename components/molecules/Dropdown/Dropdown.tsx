// components/molecules/Dropdown/Dropdown.tsx
import React, { ReactNode, useRef, useState, useEffect, useCallback } from "react";
import { Button, ButtonProps, ButtonVariant, ButtonStatus } from "@/components/atoms/Button/Button";
import { Menu, MenuItem, MenuProps } from "@mui/material";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type DropdownSize = "sm" | "md" | "lg" | "xl";
export type DropdownVariant = ButtonVariant;
export type DropdownStatus = ButtonStatus;

export interface DropdownItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string; // Novo suporte para links
  disabled?: boolean;
  className?: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  triggerButtonProps?: ButtonProps;
  variant?: DropdownVariant;
  status?: DropdownStatus;
  size?: DropdownSize;
  label?: string;
  className?: string;
  menuClassName?: string;
  menuProps?: Partial<MenuProps>;
  onOpenChange?: (isOpen: boolean) => void;
}

export function Dropdown({
  items,
  trigger,
  triggerButtonProps = {},
  variant = "primary",
  status = "default",
  size = "md",
  label,
  className,
  menuClassName,
  menuProps = {},
  onOpenChange,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  // Aplicamos variant, status e size ao botão padrão
  const buttonProps: ButtonProps = {
    variant,
    status,
    size,
    iconPosition: "right",
    icon: isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />,
    ...triggerButtonProps,
  };

  const defaultTrigger = (
    <div ref={anchorRef}>
      <Button
        {...buttonProps}
        label={label}
        onClick={handleOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
      />
    </div>
  );

  // Fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClose]);

  return (
    <div className={clsx("relative inline-block", className)}>
      {trigger ? (
        <div ref={anchorRef}>
          <Link
            href="#"
            onClick={handleOpen}
            className="cursor-pointer focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            {trigger}
          </Link>
        </div>
      ) : (
        defaultTrigger
      )}

      <Menu
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        {...menuProps}
        slotProps={{
          paper: {
            className: clsx(
              "rounded-lg",
              "border border-gray-200 dark:border-gray-700",
              "bg-white dark:!bg-gray-800",
              "shadow-lg",
              menuClassName,
            ),
          },
        }}
      >
        {items.map((item) => {
          const content = (
            <div
              className={clsx(
                "flex items-center gap-2 text-sm w-full text-left min-w-[50px]",
                "text-gray-600 dark:text-gray-300",
                {
                  "opacity-50 cursor-not-allowed": item.disabled,
                  "cursor-pointer": !item.disabled,
                },
                item.className,
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} passHref>
                <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">{content}</div>
              </Link>
            );
          }

          return (
            <MenuItem
              key={item.id}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick?.();
                  handleClose();
                }
              }}
              disabled={item.disabled}
              className="w-full p-0"
            >
              {content}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
