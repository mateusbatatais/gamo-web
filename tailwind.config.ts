import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1) Titulamos fonts como no seu exemplo, mas herdamos sans-serif padrão
      fontFamily: {
        sans: ["Inter", ...(defaultTheme.fontFamily.sans as string[])],
        mono: ["Roboto Mono", ...(defaultTheme.fontFamily.mono as string[])],
      },

      // 2) Cores semânticas “completas”: cada cor tem tons de 50 até 900
      colors: {
        primary: {
          50: "#fff8f1",
          100: "#ffebd5",
          200: "#ffd3a6",
          300: "#ffbb77",
          400: "#ffa547",
          500: "#ee8f0b", // seu laranja principal
          600: "#cc7b08",
          700: "#a56006",
          800: "#7a4004",
          900: "#4e2603",
        },
        secondary: {
          50: "#f3fbfc",
          100: "#d2f1f4",
          200: "#a8e3e8",
          300: "#7ed4dc",
          400: "#54c6d1",
          500: "#2d8eac", // seu ciano
          600: "#246f89",
          700: "#1b515f",
          800: "#113335",
          900: "#08191a",
        },
        success: {
          50: "#f2fdf5",
          100: "#d9fcef",
          200: "#aef9df",
          300: "#83f6cf",
          400: "#58f3bf",
          500: "#22c55e", // verde
          600: "#1b9e4b",
          700: "#15783a",
          800: "#0f5228",
          900: "#082a17",
        },
        danger: {
          50: "#ffe5e5",
          100: "#fbbaba",
          200: "#f28c8c",
          300: "#ea5e5e",
          400: "#e23030",
          500: "#dc2626", // vermelho
          600: "#b21f1f",
          700: "#891919",
          800: "#601313",
          900: "#380c0c",
        },
        warning: {
          50: "#fff9ec",
          100: "#fff1c8",
          200: "#ffe695",
          300: "#ffdb63",
          400: "#ffd131",
          500: "#f59e0b", // laranja claro
          600: "#c47e08",
          700: "#955d06",
          800: "#633c04",
          900: "#311e02",
        },
        info: {
          50: "#f0f9fc",
          100: "#d7f2f8",
          200: "#b0e5f1",
          300: "#89d7ea",
          400: "#62c9e3",
          500: "#407281", // azul-esverdeado
          600: "#345c68",
          700: "#28464f",
          800: "#1c2f36",
          900: "#10191d",
        },

        // 3) Accent e neutras (podem ganhar subtons se quiser)
        accent: {
          50: "#e6fcf5",
          100: "#bff8e9",
          200: "#99f3dd",
          300: "#72efd1",
          400: "#4cebbf",
          500: "#00d084", // realce
          600: "#00ac6b",
          700: "#008552",
          800: "#005e3a",
          900: "#003721",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },

      // 4) Bordas arredondadas “semânticas” (só um exemplo extra)
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },

  plugins: [],
  darkMode: "class",
} satisfies Config;
