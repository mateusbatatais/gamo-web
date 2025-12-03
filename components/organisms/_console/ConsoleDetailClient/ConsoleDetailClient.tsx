"use client";

import { useTranslations } from "next-intl";
import useConsoleDetails from "@/hooks/useConsoleDetails";
import ConsoleInfo from "@/components/organisms/_console/ConsoleInfo/ConsoleInfo";
import ConsoleSkinCard from "@/components/molecules/_console/ConsoleSkinCard/ConsoleSkinCard";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useEffect } from "react";
import { Card } from "@/components/atoms/Card/Card";
import { ConsoleInfoSkeleton } from "@/components/organisms/_console/ConsoleInfo/ConsoleInfo.skeleton";
import { ConsoleSkinCardSkeleton } from "@/components/molecules/_console/ConsoleSkinCard/ConsoleSkinCard.skeleton";
import { Joystick } from "lucide-react";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useFavorite } from "@/hooks/useFavorite";
import { CardActionButtons } from "@/components/molecules/CardActionButtons/CardActionButtons";
import { SkinDetail } from "@/@types/catalog.types";
import ConsoleAccessories from "@/components/molecules/_console/ConsoleAccessories/ConsoleAccessories";
import { ReportProblem } from "@/components/molecules/ReportProblem/ReportProblem";
import ConsoleMarket from "@/components/organisms/_console/ConsoleMarket/ConsoleMarket";

export default function ConsoleDetailClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const t = useTranslations("ConsoleDetails");
  const { data, isLoading, isError, error } = useConsoleDetails(slug || "", locale || "pt");
  const { showToast } = useToast();
  const { setItems } = useBreadcrumbs();

  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();

  const handleToggleFavorite = async () => {
    if (!data) return;

    try {
      await toggleFavorite({
        itemId: data.id,
        itemType: "CONSOLE",
      });
    } catch {}
  };

  useEffect(() => {
    if (isError && error) {
      showToast(error.message || t("notFound"), "danger");
    }
  }, [isError, error, t, showToast]);

  useEffect(() => {
    setItems([
      {
        label: t("catalog"),
        href: "/console-catalog",
        icon: <Joystick size={16} className="text-primary-500" />,
      },
      { label: data?.consoleName + " " + data?.name || "" },
    ]);

    return () => setItems([]);
  }, [setItems, t, data]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl">
        <ConsoleInfoSkeleton />
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
            {t("availableSkins")}
          </h2>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {[...Array(4)].map((_, index) => (
              <ConsoleSkinCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (!isLoading && !data) {
    return (
      <div className="container mx-auto">
        <Card>
          <div className="text-center py-12 text-gray-500">{t("notFound")}</div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10" data-testid="favorite-action-button">
          <CardActionButtons
            loading={isLoading}
            favoriteLoading={favoriteLoading}
            actions={[
              {
                key: "favorite",
                active: data.isFavorite,
                onClick: handleToggleFavorite,
              },
            ]}
          />
        </div>

        <ConsoleInfo consoleVariant={data} />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
          {t("availableSkins")} ({data.skins.length})
        </h2>

        {data.skins.length > 0 ? (
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {data.skins.map((skin: SkinDetail) => (
              <ConsoleSkinCard
                key={skin.id}
                skin={skin}
                consoleId={data.consoleId}
                consoleVariantId={data.id}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t("noSkinsAvailable")}
            </div>
          </Card>
        )}
      </section>

      <ConsoleAccessories consoleId={data.consoleId} />

      <ConsoleMarket variantSlug={data.slug} />

      <ReportProblem />
    </div>
  );
}
