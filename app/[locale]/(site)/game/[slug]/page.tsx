import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { fetchApiServer } from "@/lib/api-server";
import { GameWithStats } from "@/@types/catalog.types";
import GameDetailClient from "@/components/organisms/_game/GameDetailClient/GameDetailClient";
import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "GameDetails" });

  try {
    const game = await fetchApiServer<GameWithStats>(`/games/${slug}`);

    return {
      title: `${game.name} | Gamo`,
      description: game.description || t("defaultDescription"),
      openGraph: {
        title: game.name,
        description: game.description || t("defaultDescription"),
        images: game.imageUrl ? [game.imageUrl] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: game.name,
        description: game.description || t("defaultDescription"),
        images: game.imageUrl ? [game.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Game not found | Gamo",
    };
  }
}

export default async function GameDetailPage({ params }: Props) {
  const { slug } = await params;
  let game: GameWithStats | null = null;

  try {
    game = await fetchApiServer<GameWithStats>(`/games/${slug}`);
  } catch {
    // Ignore error, client component handles 404 UI
  }

  const jsonLd = game
    ? {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.name,
        description: game.description,
        image: game.imageUrl,
        datePublished: game.releaseDate,
        genre: game.genres?.map((g) => g.toString()), // Assuming genres are IDs, might need mapping if names available
        // Add more fields as available
        aggregateRating: game.score
          ? {
              "@type": "AggregateRating",
              ratingValue: game.score,
              bestRating: 100,
              worstRating: 0,
            }
          : undefined,
      }
    : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <GameDetailClient />
    </>
  );
}
