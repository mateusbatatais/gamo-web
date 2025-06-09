import { Locale, NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.scss";
import { Providers } from "@/components/Providers";
import { Lato } from "next/font/google";
import LogRocketInit from "@/components/atoms/LogRocketInit/LogRocketInit";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lato",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

// projeto referencia:https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/%5Blocale%5D/layout.tsx
// https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#static-rendering

export async function generateMetadata(props: Omit<Props, "children">) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: t("siteName"),
    description: t("siteDescription"),
    url: `https://gamo.games/`,
  };
}

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
