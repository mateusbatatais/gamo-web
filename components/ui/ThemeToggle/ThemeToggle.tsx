"use client";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "../ui/Button/Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded bg-neutral-300 dark:bg-neutral-700"
      label={theme === "light" ? "🌙" : "☀️"}
      title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      variant="transparent"
    ></Button>
  );
}
