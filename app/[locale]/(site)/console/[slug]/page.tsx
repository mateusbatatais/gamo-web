// app/[locale]/console/[slug]/page.tsx
"use client";

import { useTranslations } from "next-intl";
import useConsoleDetails from "@/hooks/useConsoleDetails";
import ConsoleInfo from "@/components/organisms/ConsoleInfo/ConsoleInfo";
import SkinCard from "@/components/molecules/SkinCard/SkinCard";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useEffect } from "react";
import { Card } from "@/components/atoms/Card/Card";
import { ConsoleInfoSkeleton } from "@/components/organisms/ConsoleInfo/ConsoleInfo.skeleton";
import { SkinCardSkeleton } from "@/components/molecules/SkinCard/SkinCard.skeleton";
import { Joystick } from "lucide-react";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";

export default function ConsoleDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const t = useTranslations("ConsoleDetails");
  const { data, loading, error } = useConsoleDetails(slug || "", locale || "pt");
  const { showToast } = useToast();
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    if (error) {
      showToast(error || t("notFound"), "danger");
    }
  }, [error, t, showToast]);

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
      {loading ? <ConsoleInfoSkeleton /> : data ? <ConsoleInfo consoleVariant={data} /> : null}

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-neutral-300 dark:border-gray-700">
          {t("availableSkins")} {!loading && data ? `(${data.skins.length})` : ""}
        </h2>

        {loading ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {[...Array(4)].map((_, index) => (
              <SkinCardSkeleton key={index} />
            ))}
          </div>
        ) : data ? (
          data.skins.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
              {data.skins.map((skin) => (
                <SkinCard
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
          )
        ) : null}
      </section>

      {!loading && (
        <Card className="bg-gray-50 dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4">Mercado</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Colocar itens desse modelo que estão a venda
          </p>
        </Card>
      )}
    </div>
  );
}
