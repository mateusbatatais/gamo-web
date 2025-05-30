import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { Button } from "@/components/Button/Button";
import { Home } from "lucide-react";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div>
      <h1>{t("title")}</h1>
      <Link href="/about">{t("about")}</Link>
      <ThemeToggle></ThemeToggle>
      <p className="text-primary ">ala</p>
      <Button
        label="teste"
        size="sm"
        icon={<Home className="text-secondary " />}
      />
    </div>
  );
}
