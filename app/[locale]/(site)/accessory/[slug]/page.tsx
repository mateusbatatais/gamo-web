import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchApiServer } from "@/lib/api-server";
import { Accessory } from "@/@types/catalog.types";
import AccessoryDetailClient from "@/components/organisms/_accessory/AccessoryDetailClient/AccessoryDetailClient";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "AccessoryDetails" });

  try {
    const accessory = await fetchApiServer<Accessory>(`/accessories/${slug}?locale=${locale}`);

    const title = `${accessory.name} | Gamo`;
    const description = accessory.description || t("defaultDescription");

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: accessory.imageUrl ? [accessory.imageUrl] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: accessory.imageUrl ? [accessory.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Accessory not found | Gamo",
    };
  }
}

import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";
import { AccessoryDetail } from "@/@types/catalog.types";

// ... imports

export default async function AccessoryDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  let accessory: AccessoryDetail | null = null;

  try {
    accessory = await fetchApiServer<AccessoryDetail>(`/accessories/${slug}?locale=${locale}`);
  } catch {
    // Ignore error
  }

  const jsonLd = accessory
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: accessory.name,
        description: accessory.description,
        image: accessory.imageUrl,
        brand: {
          "@type": "Brand",
          name: "Gamo", // Or fetch brand if available
        },
        releaseDate: accessory.releaseDate,
        // Add more fields as available
      }
    : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <AccessoryDetailClient />
    </>
  );
}
