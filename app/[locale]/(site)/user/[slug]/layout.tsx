// app/[locale]/user/[slug]/layout.tsx
import { ReactNode } from "react";
import type { Metadata } from "next";
import { PublicProfileHeader } from "@/components/organisms/PublicProfile/PublicProfileHeader/PublicProfileHeader";
import { ProfileNavigation } from "@/components/organisms/PublicProfile/ProfileNavigation/ProfileNavigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { fetchPublicProfile } from "./publicProfileService";

interface PublicProfileLayoutProps {
  children: ReactNode;
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

import { JsonLd } from "@/components/atoms/JsonLd/JsonLd";

// ... imports

export default async function PublicProfileLayout({ children, params }: PublicProfileLayoutProps) {
  const { slug, locale } = await params;

  try {
    const profile = await fetchPublicProfile(slug, locale);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      mainEntity: {
        "@type": "Person",
        name: profile.name,
        image: profile.profileImage,
        description: profile.description,
      },
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <JsonLd data={jsonLd} />
        <PublicProfileHeader profile={profile} />
        <div className="my-4">
          <ProfileNavigation slug={slug} />
        </div>
        <div>{children}</div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching public profile data:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  try {
    const profile = await fetchPublicProfile(slug, locale);
    const t = await getTranslations({ locale, namespace: "common" });

    const userPhoto = profile.profileImage || "https://gamo.games/images/logo-gamo.png";
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
      title: "Perfil de Usuário - Gamo",
      description: "Perfil de usuário na plataforma Gamo Games",
      openGraph: {
        title: "Perfil de Usuário - Gamo",
        description: "Perfil de usuário na plataforma Gamo Games",
        images: "https://gamo.games/images/logo-gamo.png",
      },
      twitter: {
        card: "summary_large_image",
        title: "Perfil de Usuário - Gamo",
        description: "Perfil de usuário na plataforma Gamo Games",
        images: "https://gamo.games/images/logo-gamo.png",
      },
    };
  }
}
