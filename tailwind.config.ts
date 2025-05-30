// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores semânticas principais
        primary: "#ee8f0b", // laranja principal
        secondary: "#2d8eac", // ciano acentuado

        // Estados
        success: "#22c55e", // verde
        danger: "#dc2626", // vermelho
        warning: "#f59e0b", // amarelo / laranja claro
        info: "#407281", // azul-esverdeado

        accent: {
          500: "#00d084",
        },
        neutral: {
          100: "#f5f5f5",
          300: "#d4d4d4",
          500: "#a3a3a3",
          700: "#525252",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["Roboto Mono", "ui-monospace"],
      },
      borderRadius: {
        md: "0.375rem",
        lg: "0.5rem",
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
