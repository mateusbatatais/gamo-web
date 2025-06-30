"use client";
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    // Inicialização sincrona com localStorage
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = document.documentElement;

    // Aplicar tema imediatamente após hidratação
    const applyTheme = (theme: "light" | "dark") => {
      root.setAttribute("data-theme", theme);
      root.style.colorScheme = theme;
    };

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
