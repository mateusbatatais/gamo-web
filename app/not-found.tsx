import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/contexts/Providers";
import { ThemeProvider } from "next-themes";
import NotFound from "@/components/templates/not-found/NotFound";

export default async function GlobalNotFound() {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <ThemeProvider attribute="data-theme" enableSystem>
          <NextIntlClientProvider>
            <Providers>
              <NotFound />
            </Providers>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
