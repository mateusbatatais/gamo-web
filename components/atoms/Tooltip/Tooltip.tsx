"use client";

import React from "react";
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@mui/material";
import clsx from "clsx";

export interface TooltipProps extends Omit<MuiTooltipProps, "title"> {
  title: React.ReactNode;
  variant?: "default" | "light" | "dark";
  placement?: "top" | "bottom" | "left" | "right";
  arrow?: boolean;
  className?: string;
}

export function Tooltip({
  title,
  children,
  variant = "default",
  placement = "top",
  arrow = true,
  className,
  ...props
}: TooltipProps) {
  return (
    <MuiTooltip
      title={
        <div
          className={clsx("px-3 py-2 text-sm font-medium rounded-md", {
            "bg-neutral-800 text-neutral-50 dark:bg-neutral-700": variant === "default",
            "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100":
              variant === "light",
            "bg-neutral-900 text-white": variant === "dark",
          })}
        >
          {title}
        </div>
      }
      placement={placement}
      arrow={arrow}
      classes={{
        tooltip: clsx("!bg-transparent !p-0 !max-w-xs", "!shadow-md dark:!shadow-none", className),
        arrow: clsx(
          variant === "default"
            ? "!text-neutral-800 dark:!text-neutral-700"
            : variant === "light"
              ? "!text-neutral-100 dark:!text-neutral-800"
              : "!text-neutral-900",
        ),
      }}
      {...props}
    >
      <span>{children}</span>
    </MuiTooltip>
  );
}
