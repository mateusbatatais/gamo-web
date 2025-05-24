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
        primary: {
          50: "#e3f2ff",
          100: "#b3daff",
          200: "#81c2ff",
          300: "#4ea9ff",
          400: "#1b91ff",
          500: "#0077e6", // cor principal
          600: "#005bb4",
          700: "#003f82",
          800: "#002451",
          900: "#000a21",
        },
        secondary: {
          500: "#ff8800",
          600: "#e67100",
        },
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
