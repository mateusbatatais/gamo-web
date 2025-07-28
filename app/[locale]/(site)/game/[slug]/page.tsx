// app/[locale]/game/[slug]/page.tsx
"use client";

import { useTranslations } from "next-intl";
import useGameDetails from "@/hooks/useGameDetails";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useEffect } from "react";
import { Card } from "@/components/atoms/Card/Card";
import GameInfo from "@/components/organisms/GameInfo/GameInfo";
import { RelationCard } from "@/components/molecules/RelationCard/RelationCard";
import Image from "next/image";
import { GameInfoSkeleton } from "@/components/organisms/GameInfo/GameInfo.skeleton";

export default function GameDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const t = useTranslations("GameDetails");
  const { data, loading, error } = useGameDetails(slug || "");
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast(error || t("notFound"), "danger");
    }
  }, [error, t, showToast]);

  if (!loading && !data) {
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
      {loading ? <GameInfoSkeleton /> : data ? <GameInfo game={data} /> : null}

      {data?.shortScreenshots && data.shortScreenshots.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
            {t("screenshots")} ({data.shortScreenshots.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.shortScreenshots.map((screenshot, index) => (
              <Card key={index} className="overflow-hidden !p-0">
                <div className="aspect-video relative">
                  <Image
                    src={screenshot}
                    alt={`${data.name} screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {data?.relations?.series && data.relations.series.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
            {t("series")} ({data.relations.series.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.relations.series.map((game) => (
              <RelationCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Relações: DLCs e Expansões */}
      {data?.relations?.additions && data.relations.additions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
            {t("additions")} ({data.relations.additions.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.relations.additions.map((game) => (
              <RelationCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Relações: Jogos Parent */}
      {data?.relations?.parents && data.relations.parents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
            {t("parents")} ({data.relations.parents.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.relations.parents.map((game) => (
              <RelationCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Seção de estatísticas */}
      {!loading && data && (
        <Card className="bg-gray-50 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4">{t("stats")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{data.owned || 0}</p>
              <p>{t("owned")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{data.playing || 0}</p>
              <p>{t("playing")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{data.beaten || 0}</p>
              <p>{t("beaten")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{data.dropped || 0}</p>
              <p>{t("dropped")}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
