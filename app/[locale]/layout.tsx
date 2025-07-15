import { Locale, NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.scss";
import { Quicksand } from "next/font/google";
import LogRocketInit from "@/components/atoms/LogRocketInit/LogRocketInit";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import { Providers } from "@/contexts/Providers";
import { ThemeProvider } from "next-themes";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
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
    openGraph: {
      title: t("siteName"),
      description: t("siteDescription"),
      url: `https://gamo.games/${locale}`,
      images: "https://gamo.games/images/logo-gamo.png",
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("siteDescription"),
      images: "https://gamo.games/images/logo-gamo.png",
    },
    keywords: t("siteKeywords")
      .split(",")
      .map((keyword) => keyword.trim()),
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": "-1",
      "max-video-preview": "-1",
    },
    appleWebApp: {
      capable: true,
      title: t("siteName"),
      statusBarStyle: "default",
      startupImage: "/apple-touch-icon.png",
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon-32x32.png",
      other: [
        {
          rel: "mask-icon",
          url: "/safari-pinned-tab.svg",
          color: "#5bbad5",
        },
      ],
    },
    metadataBase: new URL("https://gamo.games/"),
    alternates: {
      canonical: `https://gamo.games/${locale}`,
      languages: {
        en: "/en",
        pt: "/pt",
      },
    },
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
    <html lang={locale} className={quicksand.className} suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <ThemeProvider attribute="data-theme" enableSystem>
          <NextIntlClientProvider>
            <Providers>
              <LogRocketInit />
              {children}
            </Providers>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
