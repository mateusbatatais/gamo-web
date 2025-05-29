import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.scss";

const preview: Preview = {
  initialGlobals: {
    locale: "pt",
    locales: {
      en: "English",
      pt: "Português",
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
