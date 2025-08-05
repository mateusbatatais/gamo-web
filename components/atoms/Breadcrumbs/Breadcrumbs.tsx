"use client";

import React, { useState } from "react";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { BreadcrumbItem, useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { MoreVert } from "@mui/icons-material";
import { HomeIcon } from "lucide-react";

interface BreadcrumbsProps {
  condensed?: boolean;
  maxItems?: number;
}

export function Breadcrumbs({ condensed = false, maxItems = 3 }: BreadcrumbsProps) {
  const pathname = usePathname();
  const { items } = useBreadcrumbs();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Usar apenas itens do contexto ou estrutura básica sem formatação
  const breadcrumbs = items.length > 0 ? items : generateBasicBreadcrumbs(pathname);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Renderização normal (não condensada)
  if (!condensed || breadcrumbs.length <= maxItems) {
    return (
      <div className={clsx("flex-grow container mx-auto")}>
        <MuiBreadcrumbs
          aria-label="breadcrumb"
          className={clsx("text-neutral-700 dark:text-neutral-300 pt-2 px-4")}
          separator={<span className="text-neutral-400 dark:text-neutral-500 mx-1">/</span>}
        >
          <Link
            href="/"
            className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
          >
            <HomeIcon size={16} /> Home
          </Link>

          {breadcrumbs.map((breadcrumb, index) => (
            <BreadcrumbItemRenderer
              key={index}
              breadcrumb={breadcrumb}
              isLast={index === breadcrumbs.length - 1}
            />
          ))}
        </MuiBreadcrumbs>
      </div>
    );
  }

  // Renderização condensada
  return (
    <div
      className={clsx(
        "flex-grow container mx-auto flex items-center text-neutral-700 dark:text-neutral-300 pt-2 px-4",
      )}
    >
      <Box className="flex items-center">
        <Link
          href="/"
          className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 mr-1"
        >
          <HomeIcon size={16} />
        </Link>

        <span className="text-neutral-400 dark:text-neutral-500 mx-1">/</span>

        <IconButton
          size="small"
          onClick={handleClick}
          className="text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <MoreVert fontSize="small" />
        </IconButton>

        <span className="text-neutral-400 dark:text-neutral-500 mx-1">/</span>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "breadcrumb-menu",
        }}
      >
        {breadcrumbs.slice(0, -1).map((breadcrumb, index) => (
          <MenuItem key={index} onClick={handleClose} dense>
            {breadcrumb.href ? (
              <Link href={breadcrumb.href} className="flex items-center gap-2 w-full">
                {breadcrumb.icon && <span>{breadcrumb.icon}</span>}
                <span className="truncate max-w-xs">{breadcrumb.label}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {breadcrumb.icon && <span>{breadcrumb.icon}</span>}
                {breadcrumb.label}
              </div>
            )}
          </MenuItem>
        ))}
      </Menu>
      <BreadcrumbItemRenderer breadcrumb={breadcrumbs[breadcrumbs.length - 1]} isLast={true} />
    </div>
  );
}

// Componente auxiliar para renderizar cada item
function BreadcrumbItemRenderer({
  breadcrumb,
  isLast,
}: {
  breadcrumb: BreadcrumbItem;
  isLast: boolean;
}) {
  return breadcrumb.href ? (
    <Link
      href={breadcrumb.href}
      className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
    >
      {breadcrumb.icon && <span className="flex-shrink-0">{breadcrumb.icon}</span>}
      <span className={clsx(isLast ? "font-medium" : "", "line-clamp-1")}>{breadcrumb.label}</span>
    </Link>
  ) : (
    <Typography
      className={clsx("text-inherit flex items-center gap-1", isLast ? "font-medium" : "")}
    >
      {breadcrumb.icon && <span className="flex-shrink-0">{breadcrumb.icon}</span>}
      <span className="line-clamp-1 dark:text-gray-400">{breadcrumb.label}</span>
    </Typography>
  );
}

function generateBasicBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove o locale da URL (ex: /pt/console → /console)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  const segments = pathWithoutLocale.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    // Usar o segmento cru SEM formatação
    return {
      label: segment,
      href: isLast ? undefined : href,
    };
  });
}
