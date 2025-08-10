"use client";

import React, { useEffect } from "react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  modalId?: string; // Identificador único para o modal
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
  modalId, // Nova prop

  ...props
}: DialogProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const shouldOpen = modalId && searchParams.get("modal") === modalId;

  // Fecha o modal e remove o parâmetro da URL
  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`${pathname}?${params.toString()}`);
    onClose?.();
  };

  // Abre o modal e atualiza a URL
  const openModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", modalId!);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Sincroniza o estado do modal com a URL
  useEffect(() => {
    if (modalId && shouldOpen && !props.open) {
      openModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalId, shouldOpen]);
  return (
    <MuiDialog
      fullWidth
      maxWidth={sizeMap[size]}
      {...props}
      className={clsx("custom-dialog-root", className)}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "var(--border-radius-xl)",
          background: "var(--color-neutral-50)",
          color: "var(--color-neutral-900)",
          // Modo escuro usando classes Tailwind
          "@apply dark:bg-gray-800 dark:text-neutral-100": {},
        },
        ...props.sx,
      }}
      onClose={handleCloseModal}
      open={!!shouldOpen || !!props.open}
    >
      <DialogTitle className="flex items-center gap-2 m-0 p-3 border-b border-neutral-200 dark:border-neutral-700 dark:bg-gray-800">
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
      </DialogTitle>

      <DialogContent
        dividers
        className="
          py-3 px-3 
          text-neutral-700 dark:text-neutral-300
          bg-neutral-50 dark:bg-gray-800
        "
      >
        {children}
      </DialogContent>

      {(actions || actionButtons) && (
        <DialogActions
          data-testid="dialog-actions"
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
        </DialogActions>
      )}
    </MuiDialog>
  );
}
