"use client";

import React from "react";
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Button, ButtonProps } from "../Button/Button";
import clsx from "clsx";
import { X } from "lucide-react";

export type DialogSize = "sm" | "md" | "lg" | "xl";

interface DialogProps extends Omit<MuiDialogProps, "maxWidth"> {
  title: string;
  subtitle?: string;
  onClose: () => void;
  actions?: React.ReactNode;
  size?: DialogSize;
  icon?: React.ReactNode;
  closeButtonVariant?: "icon" | "text";
  actionButtons?: {
    confirm?: ButtonProps;
    cancel?: ButtonProps;
  };
}

const sizeMap: Record<DialogSize, MuiDialogProps["maxWidth"]> = {
  sm: "xs",
  md: "sm",
  lg: "md",
  xl: "lg",
};

export function Dialog({
  title,
  subtitle,
  onClose,
  children,
  actions,
  size = "md",
  icon,
  closeButtonVariant = "icon",
  actionButtons,
  className,
  ...props
}: DialogProps) {
  return (
    <MuiDialog
      onClose={onClose}
      fullWidth
      maxWidth={sizeMap[size]}
      {...props}
      className={clsx("custom-dialog-root", className)}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "var(--border-radius-xl)",
          background: "var(--color-neutral-50)",
          color: "var(--color-neutral-900)",
          // Modo escuro
          "@media (prefers-color-scheme: dark)": {
            background: "var(--color-gray-800)",
            color: "var(--color-neutral-100)",
          },
        },
        ...props.sx,
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid var(--color-neutral-200)",
          // Modo escuro
          "@media (prefers-color-scheme: dark)": {
            borderBottom: "1px solid var(--color-neutral-700)",
          },
        }}
      >
        {icon && (
          <Box
            sx={{
              color: "var(--color-primary-500)",
              // Modo escuro
              "@media (prefers-color-scheme: dark)": {
                color: "var(--color-primary-400)",
              },
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            component="div"
            fontWeight={600}
            sx={{
              color: "inherit",
              // Modo escuro
              "@media (prefers-color-scheme: dark)": {
                color: "var(--color-neutral-100)",
              },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              mt={0.5}
              sx={{
                color: "var(--color-neutral-500)",
                // Modo escuro
                "@media (prefers-color-scheme: dark)": {
                  color: "var(--color-neutral-400)",
                },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {closeButtonVariant === "icon" ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: "var(--color-neutral-500)",
              "&:hover": {
                color: "var(--color-neutral-700)",
                background: "var(--color-neutral-100)",
              },
              // Modo escuro
              "@media (prefers-color-scheme: dark)": {
                color: "var(--color-neutral-400)",
                "&:hover": {
                  color: "var(--color-neutral-200)",
                  background: "var(--color-neutral-700)",
                },
              },
            }}
          >
            <X />
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
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          py: 3,
          px: 3,
          color: "var(--color-neutral-700)",
          background: "var(--color-neutral-50)",
          // Modo escuro
          "@media (prefers-color-scheme: dark)": {
            color: "var(--color-neutral-300)",
            background: "var(--color-gray-800)",
          },
        }}
      >
        {children}
      </DialogContent>

      {(actions || actionButtons) && (
        <DialogActions
          data-testid="dialog-actions"
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid var(--color-neutral-200)",
            background: "var(--color-neutral-100)",
            // Modo escuro
            "@media (prefers-color-scheme: dark)": {
              borderTop: "1px solid var(--color-neutral-700)",
              background: "var(--color-neutral-800)",
            },
          }}
        >
          {actions || (
            <Box display="flex" gap={2}>
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
        </DialogActions>
      )}
    </MuiDialog>
  );
}
