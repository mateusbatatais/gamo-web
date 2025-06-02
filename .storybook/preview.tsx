import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../messages/en.json";
import ptMessages from "../messages/pt.json";
import "../app/globals.scss";

import { withThemeByClassName } from "@storybook/addon-themes";

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
        <NextIntlClientProvider locale={locale} messages={messagesForLocale}>
          <Story />
        </NextIntlClientProvider>
      );
    },
    withThemeByClassName({
      themes: {
        // nameOfTheme: 'classNameForTheme',
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
