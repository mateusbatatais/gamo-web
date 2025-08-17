// app/[locale]/game/[slug]/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/atoms/Card/Card";
import GameInfo from "@/components/organisms/GameInfo/GameInfo";
import { RelationCard } from "@/components/molecules/RelationCard/RelationCard";
import Image from "next/image";
import { GameInfoSkeleton } from "@/components/organisms/GameInfo/GameInfo.skeleton";
import { GalleryDialog } from "@/components/molecules/GalleryDialog/GalleryDialog";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { Gamepad } from "lucide-react";
import { useFavorite } from "@/hooks/useFavorite";
import { CardActionButtons } from "@/components/molecules/CardActionButtons/CardActionButtons";
import useGameDetails from "@/hooks/useGameDetails";
import { Game } from "@/@types/catalog.types";

export default function GameDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { setItems } = useBreadcrumbs();

  const t = useTranslations("GameDetails");
  const { data, isLoading, isError } = useGameDetails(slug || "");

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();

  const screenshots = data?.shortScreenshots || [];
  const seriesGames = data?.series?.games || [];
  const childrenGames = data?.children || [];
  const parentGames = data?.parents || [];

  const handleToggleFavorite = async () => {
    if (!data) return;

    try {
      await toggleFavorite({
        itemId: data.id,
        itemType: "GAME",
      });
    } catch {}
  };

  const handleOpenGallery = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setGalleryOpen(false);
  };

  useEffect(() => {
    if (isError) {
      notFound();
    }
  }, [isError]);

  useEffect(() => {
    setItems([
      {
        label: t("catalog"),
        href: "/game-catalog",
        icon: <Gamepad size={16} className="text-primary-500" />,
      },
      { label: data?.name || "" },
    ]);

    return () => setItems([]);
  }, [setItems, t, data?.name]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl">
        <GameInfoSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto">
        <Card>
          <div className="text-center py-12 text-gray-500">{t("notFound")}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <CardActionButtons
            loading={isLoading}
            favoriteLoading={favoriteLoading}
            actions={[
              {
                key: "favorite",
                active: data.isFavorite || false,
                onClick: handleToggleFavorite,
              },
            ]}
          />
        </div>

        <GameInfo game={data} />
      </div>

      {screenshots.length > 0 && (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
              {t("screenshots")} ({screenshots.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {screenshots.map((screenshot: string, index: number) => (
                <button
                  type="button"
                  key={index}
                  className="overflow-hidden rounded-lg cursor-pointer transform transition-transform hover:scale-[1.02] shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none"
                  onClick={() => handleOpenGallery(index)}
                  aria-label={`${data.name || "Game"} screenshot ${index + 1}`}
                >
                  <div className="aspect-video relative">
                    <Image
                      src={screenshot}
                      alt={`${data.name || "Game"} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <GalleryDialog
            open={galleryOpen}
            onClose={handleCloseGallery}
            images={screenshots}
            initialIndex={selectedImageIndex}
            gameName={data.name || ""}
          />
        </>
      )}

      {seriesGames.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
            {t("series")} ({seriesGames.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {seriesGames.map((game: Game) => (
              <RelationCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {childrenGames?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
            {t("additions")} ({childrenGames.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {childrenGames.map((game: Game) => (
              <RelationCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {parentGames?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
            {t("parents")} ({parentGames.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {parentGames.map((game: Game) => (
              <RelationCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      <Card className="bg-gray-50 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">{t("stats")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{0}</p>
            <p>{t("owned")}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{0}</p>
            <p>{t("playing")}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{0}</p>
            <p>{t("beaten")}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{0}</p>
            <p>{t("dropped")}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
