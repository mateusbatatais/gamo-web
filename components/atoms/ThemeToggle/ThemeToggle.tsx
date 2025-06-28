"use client";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/atoms/Button/Button";
import clsx from "clsx";
import { Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

export type ThemeToggleSize = "sm" | "md" | "lg";
export type ThemeToggleVariant = "icon" | "text" | "full";

export interface ThemeToggleProps {
  size?: ThemeToggleSize;
  variant?: ThemeToggleVariant;
  className?: string;
  showSystemOption?: boolean;
}

export function ThemeToggle({
  size = "md",
  variant = "icon",
  className,
  showSystemOption = false,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme() as {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderizar placeholder durante SSR
  if (!mounted || !theme) {
    return (
      <div
        data-testid="theme-toggle-skeleton"
        className={clsx(
          "animate-pulse rounded-full bg-gray-200 dark:bg-gray-700",
          size === "sm" ? "w-8 h-8" : size === "md" ? "w-10 h-10" : "w-12 h-12",
        )}
      />
    );
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
    } else {
      setTheme(newTheme);
    }
  };

  const getButtonLabel = () => {
    if (variant === "icon") return "";
    if (theme === "light") return "Modo Escuro";
    return "Modo Claro";
  };

  const getButtonTitle = () => {
    if (theme === "light") return "Ativar modo escuro";
    return "Ativar modo claro";
  };

  const sizeClasses: Record<ThemeToggleSize, string> = {
    sm: "text-sm p-1.5",
    md: "text-base p-2",
    lg: "text-lg p-2.5",
  };

  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1",
        variant === "full" && "bg-gray-100 dark:bg-gray-800 rounded-full p-1",
        className,
      )}
    >
      {showSystemOption && variant === "full" && (
        <Button
          onClick={() => handleThemeChange("system")}
          variant="transparent"
          size={size}
          className={clsx("rounded-full", theme === "system" && "bg-gray-200 dark:bg-gray-700")}
          title="Usar tema do sistema"
          aria-label="Usar tema do sistema"
          icon={<Monitor size={iconSize} />}
        />
      )}

      <Button
        onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
        className={clsx(
          "rounded-full transition-colors",
          sizeClasses[size],
          variant !== "full" &&
            "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
        )}
        title={getButtonTitle()}
        aria-label={getButtonTitle()}
        variant="transparent"
        size={size}
        icon={theme === "light" ? <Moon size={iconSize} /> : <Sun size={iconSize} />}
        label={getButtonLabel()}
      />
    </div>
  );
}
