import { useTranslations } from "next-intl";

export default function Catalog() {
  const t = useTranslations("HomePage");
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div>
          <h1>{t("title")}</h1>
        </div>
      </main>
    </div>
  );
}
