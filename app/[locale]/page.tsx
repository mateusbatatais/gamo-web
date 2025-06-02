import { useTranslations } from "next-intl";
import Header from "@/components/Layout/Header/Header";
import Footer from "@/components/Layout/Footer/Footer";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div>
          <h1>{t("title")}</h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}
