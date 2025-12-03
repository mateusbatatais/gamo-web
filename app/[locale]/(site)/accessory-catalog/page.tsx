import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AccessoryCatalogClient from "@/components/organisms/_accessory/AccessoryCatalogClient/AccessoryCatalogClient";
import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Breadcrumbs" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("accessory-catalog")} | ${tCommon("siteName")}`,
    description: tCommon("siteDescription"),
    openGraph: {
      title: `${t("accessory-catalog")} | ${tCommon("siteName")}`,
      description: tCommon("siteDescription"),
    },
  };
}

export default async function AccessoryCatalogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Breadcrumbs" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("accessory-catalog"),
    description: tCommon("siteDescription"),
    url: `https://gamo.games/${locale}/accessory-catalog`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <AccessoryCatalogClient locale={locale} />
    </>
  );
}
