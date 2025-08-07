"use client";

import React from "react";
import { BookmarkPlus, HeartPlus, Tag, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, ButtonProps } from "@/components/atoms/Button/Button";
import { Tooltip } from "@/components/atoms/Tooltip/Tooltip";

interface ActionButton {
  key: string;
  icon: LucideIcon;
  tooltipKey: string;
  onClick?: () => void;
  buttonProps?: Partial<ButtonProps>;
  active?: boolean;
  activeColor?: string; // Nova propriedade para cor quando ativo
  inactiveColor?: string; // Opcional: cor quando inativo
}

interface CardActionButtonsProps {
  actions?: Partial<ActionButton>[];
}

export function CardActionButtons({ actions }: CardActionButtonsProps) {
  const t = useTranslations("CardActions");

  // Ações padrão que podem ser sobrescritas
  const defaultActions: ActionButton[] = [
    {
      key: "favorite",
      icon: BookmarkPlus,
      tooltipKey: "addToFavorites",
      onClick: () => {},
      buttonProps: {
        variant: "transparent",
        size: "sm",
      },
      active: false,
      activeColor: "#ee8f0b",
      inactiveColor: "#2d8eac",
    },
    {
      key: "collection",
      icon: HeartPlus,
      tooltipKey: "addToCollection",
      onClick: () => {},
      buttonProps: {
        variant: "transparent",
        size: "sm",
      },
      active: false,
      activeColor: "#ee8f0b",
      inactiveColor: "#2d8eac",
    },
    {
      key: "market",
      icon: Tag,
      tooltipKey: "market",
      onClick: () => {},
      buttonProps: {
        variant: "transparent",
        size: "sm",
      },
      active: false,
      activeColor: "#ee8f0b",
      inactiveColor: "#2d8eac",
    },
  ];

  // Combina ações padrão com customizações
  const finalActions = defaultActions.map((defaultAction) => {
    const customAction = actions?.find((a) => a.key === defaultAction.key);
    return {
      ...defaultAction,
      ...customAction,
      icon: customAction?.icon || defaultAction.icon,
      active: customAction?.active ?? defaultAction.active,
      activeColor: customAction?.activeColor || defaultAction.activeColor,
      inactiveColor: customAction?.inactiveColor || defaultAction.inactiveColor,
    };
  });

  return (
    <div className="flex gap-1">
      {finalActions.map((action) => {
        // Determina a cor do ícone baseado no estado active
        const iconColor = action.active ? action.activeColor : action.inactiveColor;

        return (
          <Tooltip key={action.key} title={t(action.tooltipKey)}>
            <Button
              variant="secondary"
              icon={<action.icon size={18} color={iconColor} />}
              aria-label={t(action.tooltipKey)}
              onClick={action.onClick}
              {...action.buttonProps}
              className={clsx(action.buttonProps?.className, action.active && "")}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}

// Helper para clsx se não estiver disponível
function clsx(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}
