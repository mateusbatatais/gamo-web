'use client';

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded bg-neutral-300 dark:bg-neutral-700"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
