import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

// 1) Declare apenas constantes para o valor “500” de cada cor,
//   mas chamando-as de <nome>DEFAULT:
const primaryDEFAULT = "#ee8f0b";
const secondaryDEFAULT = "#2d8eac";
const successDEFAULT = "#22c55e";
const dangerDEFAULT = "#dc2626";
const warningDEFAULT = "#f59e0b";
const infoDEFAULT = "#407281";
const accentDEFAULT = "#00d084";
const neutralDEFAULT = "#737373";

// 2) Defina os objetos de tons numéricos (50–900) normalmente,
//    usando a constante <nome>DEFAULT para o peso 500:
const primaryColors = {
  50: "#fff8f1",
  100: "#ffebd5",
  200: "#ffd3a6",
  300: "#ffbb77",
  400: "#ffa547",
  500: primaryDEFAULT,
  600: "#cc7b08",
  700: "#a56006",
  800: "#7a4004",
  900: "#4e2603",
};

const secondaryColors = {
  50: "#f3fbfc",
  100: "#d2f1f4",
  200: "#a8e3e8",
  300: "#7ed4dc",
  400: "#54c6d1",
  500: secondaryDEFAULT,
  600: "#246f89",
  700: "#1b515f",
  800: "#113335",
  900: "#08191a",
};

const successColors = {
  50: "#f2fdf5",
  100: "#d9fcef",
  200: "#aef9df",
  300: "#83f6cf",
  400: "#58f3bf",
  500: successDEFAULT,
  600: "#1b9e4b",
  700: "#15783a",
  800: "#0f5228",
  900: "#082a17",
};

const dangerColors = {
  50: "#ffe5e5",
  100: "#fbbaba",
  200: "#f28c8c",
  300: "#ea5e5e",
  400: "#e23030",
  500: dangerDEFAULT,
  600: "#b21f1f",
  700: "#891919",
  800: "#601313",
  900: "#380c0c",
};

const warningColors = {
  50: "#fff9ec",
  100: "#fff1c8",
  200: "#ffe695",
  300: "#ffdb63",
  400: "#ffd131",
  500: warningDEFAULT,
  600: "#c47e08",
  700: "#955d06",
  800: "#633c04",
  900: "#311e02",
};

const infoColors = {
  50: "#f0f9fc",
  100: "#d7f2f8",
  200: "#b0e5f1",
  300: "#89d7ea",
  400: "#62c9e3",
  500: infoDEFAULT,
  600: "#345c68",
  700: "#28464f",
  800: "#1c2f36",
  900: "#10191d",
};

const accentColors = {
  50: "#e6fcf5",
  100: "#bff8e9",
  200: "#99f3dd",
  300: "#72efd1",
  400: "#4cebbf",
  500: accentDEFAULT,
  600: "#00ac6b",
  700: "#008552",
  800: "#005e3a",
  900: "#003721",
};

const neutralColors = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: neutralDEFAULT,
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
};

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...(defaultTheme.fontFamily.sans as string[])],
        mono: ["Roboto Mono", ...(defaultTheme.fontFamily.mono as string[])],
      },

      colors: {
        primary: {
          DEFAULT: primaryDEFAULT,
          ...primaryColors,
        },
        secondary: {
          DEFAULT: secondaryDEFAULT,
          ...secondaryColors,
        },
        success: {
          DEFAULT: successDEFAULT,
          ...successColors,
        },
        danger: {
          DEFAULT: dangerDEFAULT,
          ...dangerColors,
        },
        warning: {
          DEFAULT: warningDEFAULT,
          ...warningColors,
        },
        info: {
          DEFAULT: infoDEFAULT,
          ...infoColors,
        },
        accent: {
          DEFAULT: accentDEFAULT,
          ...accentColors,
        },
        neutral: {
          DEFAULT: neutralDEFAULT,
          ...neutralColors,
        },
      },

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
