import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.scss";
import { Providers } from "@/components/Providers";
import { Lato } from "next/font/google";
import LogRocketInit from "@/components/LogRocketInit/LogRocketInit";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lato",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={lato.variable}>
      <body className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
        <NextIntlClientProvider>
          <Providers>
            <LogRocketInit />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
