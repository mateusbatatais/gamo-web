import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/Button/Button";
import { Home } from "lucide-react";
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
          <Link href="/about">{t("about")}</Link>
          <p className="text-primary ">ala</p>
          <Button
            label="teste"
            size="sm"
            icon={<Home className="text-secondary " />}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
