import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import GameCatalogClient from "@/components/organisms/_game/GameCatalogClient/GameCatalogClient";
import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Breadcrumbs" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("game-catalog")} | ${tCommon("siteName")}`,
    description: tCommon("siteDescription"),
    openGraph: {
      title: `${t("game-catalog")} | ${tCommon("siteName")}`,
      description: tCommon("siteDescription"),
    },
  };
}

export default async function GameCatalogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Breadcrumbs" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("game-catalog"),
    description: tCommon("siteDescription"),
    url: `https://gamo.games/${locale}/game-catalog`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <GameCatalogClient />
    </>
  );
}
