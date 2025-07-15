import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div>
        <h1>{t("construction")}</h1>
      </div>
    </main>
  );
}
