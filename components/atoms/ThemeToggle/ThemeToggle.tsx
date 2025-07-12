"use client";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/atoms/Button/Button";
import clsx from "clsx";
import { Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

export interface ThemeToggleProps {
  className?: string;
  showSystemOption?: boolean;
}

export function ThemeToggle({ className, showSystemOption = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        data-testid="theme-toggle-skeleton"
        className={clsx("animate-pulse rounded-full bg-gray-200 dark:bg-gray-700")}
      />
    );
  }

  const getIcon = () => {
    if (theme === "light") return <Moon />;
    if (theme === "dark") return <Sun />;
    return <Monitor />;
  };

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  return (
    <div className={clsx("inline-flex items-center gap-1", className)}>
      {showSystemOption && (
        <Button
          onClick={() => setTheme("system")}
          variant="transparent"
          title="Usar tema do sistema"
          aria-label="Usar tema do sistema"
          icon={<Monitor />}
        />
      )}

      <Button
        onClick={toggleTheme}
        aria-label={"dark/light/system theme toggle"}
        variant="transparent"
        icon={getIcon()}
        size="sm"
      />
    </div>
  );
}
