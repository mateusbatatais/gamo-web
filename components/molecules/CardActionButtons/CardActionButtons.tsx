"use client";

import React from "react";
import { HeartPlus, Tag, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, ButtonProps } from "@/components/atoms/Button/Button";
import { Tooltip } from "@/components/atoms/Tooltip/Tooltip";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";

type IconType = React.ElementType;

interface ActionButton {
  key: string;
  icon: IconType;
  tooltipKey: string;
  onClick?: () => void;
  buttonProps?: Partial<ButtonProps>;
  active?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

interface CardActionButtonsProps {
  actions?: Partial<ActionButton>[];
  loading?: boolean;
}

export function CardActionButtons({ actions, loading }: CardActionButtonsProps) {
  const t = useTranslations("CardActions");

  const defaultActions: ActionButton[] = [
    {
      key: "favorite",
      icon: HeartPlus,
      tooltipKey: "addToFavorites",
      onClick: () => {},
      buttonProps: { variant: "transparent", size: "sm", loading },
      active: false,
      activeColor: "#ee8f0b",
      inactiveColor: "#2d8eac",
    },
    {
      key: "collection",
      icon: LibraryAddOutlinedIcon, // já usando o do Material UI
      tooltipKey: "addToCollection",
      onClick: () => {},
      buttonProps: { variant: "transparent", size: "sm", loading },
      active: false,
      activeColor: "#ee8f0b",
      inactiveColor: "#2d8eac",
    },
    {
      key: "market",
      icon: Tag,
      tooltipKey: "market",
      onClick: () => {},
      buttonProps: { variant: "transparent", size: "sm", loading },
      active: false,
      activeColor: "#ee8f0b",
      inactiveColor: "#2d8eac",
    },
  ];

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
        const IconComponent = action.icon;
        const iconColor = action.active ? action.activeColor : action.inactiveColor;

        return (
          <Tooltip key={action.key} title={t(action.tooltipKey)}>
            <Button
              variant="secondary"
              icon={
                <IconComponent
                  {...(isLucideIcon(IconComponent)
                    ? { size: 18, color: iconColor }
                    : { fontSize: "small", style: { color: iconColor, width: 18, height: 18 } })}
                />
              }
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

function isLucideIcon(icon: IconType): icon is LucideIcon {
  return typeof icon === "function" && icon.length > 0;
}

function clsx(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}
