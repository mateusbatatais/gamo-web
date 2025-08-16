// app/[locale]/user/[slug]/page.tsx
import { getServerSession } from "@/lib/auth";
import { ReactNode, Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { fetchPublicProfile } from "./publicProfileService";
import { getTranslations } from "next-intl/server";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

interface PublicProfileLayoutProps {
  children: ReactNode;
  params: {
    slug: string;
    locale: string;
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug, locale } = await params;
  const session = await getServerSession();
  const isOwner = session?.slug === slug;

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <PublicProfileConsoleGrid slug={slug} locale={locale} isOwner={isOwner} />
    </Suspense>
  );
}

export async function generateMetadata({ params }: PublicProfileLayoutProps) {
  const { slug, locale } = await params;

  try {
    const profile = await fetchPublicProfile(slug, locale);
    const t = await getTranslations({ locale, namespace: "common" });

    const userPhoto = profile.profileImage;
    const userName = profile.name || slug;

    return {
      title: `${userName} - ${t("siteName")}`,
      description: profile.description || t("siteDescription"),
      openGraph: {
        title: `${userName} - ${t("siteName")}`,
        description: profile.description || t("siteDescription"),
        url: `https://gamo.games/${locale}/user/${slug}`,
        images: [
          {
            url: userPhoto,
            width: 800,
            height: 600,
            alt: `Foto de perfil de ${userName}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${userName} - ${t("siteName")}`,
        description: profile.description || t("siteDescription"),
        images: userPhoto,
      },
    };
  } catch {
    return {
      title: "Perfil de Usuário",
      description: "Perfil de usuário na plataforma Gamo Games",
    };
  }
}
