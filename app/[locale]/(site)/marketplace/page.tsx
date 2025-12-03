import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MarketplacePageClient from "@/components/organisms/MarketplaceCatalogComponent/MarketplacePageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Marketplace" });

  return {
    title: `${t("title")} | Gamo`,
    description: t("description"),
    openGraph: {
      title: `${t("title")} | Gamo`,
      description: t("description"),
    },
  };
}

import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";

// ... imports

export default async function MarketplacePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Marketplace" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("description"),
    url: `https://gamo.games/${locale}/marketplace`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketplacePageClient />
    </>
  );
}
