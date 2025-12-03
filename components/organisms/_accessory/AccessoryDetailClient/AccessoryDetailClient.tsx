"use client";

import { useTranslations } from "next-intl";
import useAccessoryDetails from "@/hooks/useAccessoryDetails";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useEffect } from "react";
import { Card } from "@/components/atoms/Card/Card";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { useFavorite } from "@/hooks/useFavorite";
import { CardActionButtons } from "@/components/molecules/CardActionButtons/CardActionButtons";
import { Gamepad } from "lucide-react";
import AccessoryInfo from "@/components/organisms/_accessory/AccessoryInfo/AccessoryInfo";
import AccessoryVariantCard from "@/components/molecules/_accessory/AccessoryVariantCard/AccessoryVariantCard";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import AccessoryMarket from "@/components/organisms/_accessory/AccessoryMarket/AccessoryMarket";

export default function AccessoryDetailClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const t = useTranslations("AccessoryDetails");
  const { data, isLoading, isError, error } = useAccessoryDetails(slug || "", locale || "pt");
  const { showToast } = useToast();
  const { setItems } = useBreadcrumbs();

  const { toggleFavorite, isPending: favoriteLoading } = useFavorite();

  const handleToggleFavorite = async () => {
    if (!data) return;

    try {
      await toggleFavorite({
        itemId: data.id,
        itemType: "ACCESSORY",
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
        href: "/accessory-catalog",
        icon: <Gamepad size={16} className="text-primary-500" />,
      },
      { label: data?.name || "" },
    ]);

    return () => setItems([]);
  }, [setItems, t, data]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl">
        <div>
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-80 rounded" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
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

        <AccessoryInfo accessory={data} />
      </div>

      {/* Seção de variantes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
          {t("availableVariants")} ({data.variants.length})
        </h2>

        {data.variants.length > 0 ? (
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {data.variants.map((variant) => (
              <AccessoryVariantCard key={variant.id} variant={variant} accessoryId={data.id} />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {t("noVariantsAvailable")}
            </div>
          </Card>
        )}
      </section>

      <AccessoryMarket slug={data.slug} />
    </div>
  );
}
