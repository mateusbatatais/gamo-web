"use client";

import React from "react";
import {
  Drawer as MuiDrawer,
  DrawerProps as MuiDrawerProps,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Button, ButtonProps } from "../Button/Button";
import clsx from "clsx";
import { X } from "lucide-react";

interface DrawerProps extends Omit<MuiDrawerProps, "anchor"> {
  title: string;
  subtitle?: string;
  onClose: () => void;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  closeButtonVariant?: "icon" | "text";
  actionButtons?: {
    confirm?: ButtonProps;
    cancel?: ButtonProps;
  };
  anchor?: "left" | "right" | "top" | "bottom";
}

export function Drawer({
  title,
  subtitle,
  onClose,
  children,
  actions,
  icon,
  closeButtonVariant = "icon",
  actionButtons,
  className,
  anchor = "right",
  ...props
}: DrawerProps) {
  return (
    <MuiDrawer
      anchor={anchor}
      {...props}
      className={clsx("custom-drawer-root", className)}
      onClose={onClose}
    >
      <Box className="flex items-center gap-2 m-0 p-3 border-b border-neutral-200 dark:border-neutral-700 dark:bg-gray-800">
        {icon && <Box className="text-primary-500 dark:text-primary-400">{icon}</Box>}
        <Box className="flex-grow">
          <Typography
            variant="h5"
            component="div"
            fontWeight={600}
            className="text-inherit dark:text-neutral-100"
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" className="mt-0.5 text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </Typography>
          )}
        </Box>

        {closeButtonVariant === "icon" ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            className="
              text-neutral-500 hover:text-neutral-700
              hover:bg-neutral-100
              dark:text-neutral-400 dark:hover:text-neutral-200
              dark:hover:bg-neutral-700
            "
          >
            <X className="dark:text-neutral-400" />
          </IconButton>
        ) : (
          <Button
            variant="transparent"
            onClick={onClose}
            label="Fechar"
            size="sm"
            className="text-neutral-700 dark:text-neutral-300"
          />
        )}
      </Box>

      <Box
        className="
          py-3 px-3 
          text-neutral-700 dark:text-neutral-300
          bg-neutral-50 dark:bg-gray-800
          flex-grow
        "
      >
        {children}
      </Box>

      {(actions || actionButtons) && (
        <Box
          data-testid="drawer-actions"
          className="
            px-3 py-2
            border-t border-neutral-200 dark:border-neutral-700
            bg-neutral-100 dark:bg-neutral-800
          "
        >
          {actions || (
            <Box className="flex gap-2">
              <Button
                variant="outline"
                status="default"
                label="Cancelar"
                onClick={onClose}
                {...actionButtons?.cancel}
              />
              <Button variant="primary" label="Confirmar" {...actionButtons?.confirm} />
            </Box>
          )}
        </Box>
      )}
    </MuiDrawer>
  );
}
