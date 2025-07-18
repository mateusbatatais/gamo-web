// .storybook/preview.tsx
import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../messages/en.json";
import ptMessages from "../messages/pt.json";
import "../app/globals.scss";
import { Quicksand } from "next/font/google";
import { withThemeByDataAttribute } from "@storybook/addon-themes";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Idioma da aplicação",
    defaultValue: "pt",
    toolbar: {
      icon: "globe",
      items: [
        { value: "pt", title: "Português" },
        { value: "en", title: "English" },
      ],
    },
  },
};

const messages = {
  en: enMessages,
  pt: ptMessages,
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const locale = context.globals.locale || "pt";
      const messagesForLocale = messages[locale as keyof typeof messages];

      return (
        <div className={quicksand.className}>
          <NextIntlClientProvider locale={locale} messages={messagesForLocale}>
            <Story />
          </NextIntlClientProvider>
        </div>
      );
    },
    withThemeByDataAttribute({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
