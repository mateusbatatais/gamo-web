import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ConsoleCatalogClient from "@/components/organisms/_console/ConsoleCatalogClient/ConsoleCatalogClient";
import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Breadcrumbs" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("console-catalog")} | ${tCommon("siteName")}`,
    description: tCommon("siteDescription"),
    openGraph: {
      title: `${t("console-catalog")} | ${tCommon("siteName")}`,
      description: tCommon("siteDescription"),
    },
  };
}

export default async function ConsoleCatalogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Breadcrumbs" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("console-catalog"),
    description: tCommon("siteDescription"),
    url: `https://gamo.games/${locale}/console-catalog`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ConsoleCatalogClient locale={locale} />
    </>
  );
}
