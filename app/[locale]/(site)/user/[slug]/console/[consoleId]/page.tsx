// app/[locale]/(site)/user/[slug]/console/[consoleId]/page.tsx
import { PublicConsoleGamesPage } from "@/components/pages/PublicConsoleGamesPage/PublicConsoleGamesPage";

interface PageProps {
  params: Promise<{
    slug: string;
    consoleId: string;
    locale: string;
  }>;
}

export default async function ConsolePage({ params }: PageProps) {
  const { slug, consoleId, locale } = await params;

  return <PublicConsoleGamesPage slug={slug} consoleId={parseInt(consoleId)} locale={locale} />;
}
