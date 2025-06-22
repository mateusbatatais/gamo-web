"use client";

// app/[locale]/console/[slug]/page.tsx
import { useTranslations } from "next-intl";
import useConsoleDetails from "@/hooks/useConsoleDetails";
import ConsoleInfo from "@/components/organisms/ConsoleInfo/ConsoleInfo";
import Toast from "@/components/molecules/Toast/Toast";
import SkinCard from "@/components/molecules/SkinCard/SkinCard";
import { useParams } from "next/navigation";

export default function ConsoleDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;

  const t = useTranslations("ConsoleDetails");
  const { data, loading, error } = useConsoleDetails(slug || "", locale || "pt");

  if (loading) {
    return <div className="flex justify-center py-12">Loading</div>;
  }

  if (error || !data) {
    return <Toast message={error || t("notFound")} type="danger" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ConsoleInfo consoleVariant={data} />

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
          {t("availableSkins")} ({data.skins.length})
        </h2>

        {data.skins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          <div className="text-center py-12 text-gray-500">{t("noSkinsAvailable")}</div>
        )}
      </section>

      <section className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">{t("userCollections")}</h2>
        <p className="text-gray-600 mb-6">{t("collectionsDescription")}</p>
        <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors">
          {t("viewCollections")}
        </button>
      </section>
    </div>
  );
}
