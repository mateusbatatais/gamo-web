import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchApiServer } from "@/lib/api-server";
import { ConsoleVariant } from "@/@types/catalog.types";
import ConsoleDetailClient from "@/components/organisms/_console/ConsoleDetailClient/ConsoleDetailClient";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "ConsoleDetails" });

  try {
    const consoleVariant = await fetchApiServer<ConsoleVariant>(
      `/consoles/${slug}?locale=${locale}`,
    );

    const title = `${consoleVariant.consoleName} ${consoleVariant.name} | Gamo`;
    const description = consoleVariant.consoleDescription || t("defaultDescription");

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: consoleVariant.imageUrl ? [consoleVariant.imageUrl] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: consoleVariant.imageUrl ? [consoleVariant.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Console not found | Gamo",
    };
  }
}

import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";

// ... imports

export default async function ConsoleDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  let consoleVariant: ConsoleVariant | null = null;

  try {
    consoleVariant = await fetchApiServer<ConsoleVariant>(`/consoles/${slug}?locale=${locale}`);
  } catch {
    // Ignore error
  }

  const jsonLd = consoleVariant
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${consoleVariant.consoleName} ${consoleVariant.name}`,
        description: consoleVariant.consoleDescription,
        image: consoleVariant.imageUrl,
        brand: {
          "@type": "Brand",
          name: consoleVariant.consoleName,
        },
        // Add more fields as available
      }
    : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ConsoleDetailClient />
    </>
  );
}
