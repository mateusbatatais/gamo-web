"use client";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "../../atoms/Button/Button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      onClick={toggleTheme}
      className="rounded bg-neutral-300 dark:bg-neutral-700"
      label={theme === "light" ? "🌙" : "☀️"}
      title={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      variant="transparent"
    />
  );
}