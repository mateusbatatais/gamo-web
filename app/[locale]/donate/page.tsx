import { DonationForm } from "@/components/organisms/DonationForm/DonationForm";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "DonationPage" });

  return {
    title: t("searchTitle"),
    description: t("searchDescription"),
  };
}

export default function DonatePage() {
  const t = useTranslations("DonationPage");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <DonationForm mode="page" />
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>{t("securePaymentNote")}</p>
      </div>
    </div>
  );
}
