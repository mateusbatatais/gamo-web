"use client";
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const appliedTheme = theme === "system" ? systemTheme : theme;

    root.setAttribute("data-theme", appliedTheme);
    root.style.colorScheme = appliedTheme;
    setResolvedTheme(appliedTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme, resolvedTheme };
}
