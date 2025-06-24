// app/[locale]/user/[slug]/page.tsx
import { notFound } from "next/navigation";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { PublicProfileHeader } from "@/components/organisms/PublicProfile/PublicProfileHeader/PublicProfileHeader";
import { PublicProfileLayout } from "@/components/templates/Layout/PublicProfileLayout/PublicProfileLayout";
import { getPublicProfile, getUserConsolesPublic } from "@/lib/api/publicProfile";

interface PublicProfilePageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function PublicProfilePage(props: PublicProfilePageProps) {
  const params = await props.params;
  const { slug, locale } = params;

  try {
    const [profile, consoles] = await Promise.all([
      getPublicProfile(slug, locale),
      getUserConsolesPublic(slug, locale),
    ]);

    return (
      <PublicProfileLayout>
        <PublicProfileHeader profile={profile} />
        <div className="mt-8">
          <PublicProfileConsoleGrid consoles={consoles} />
        </div>
      </PublicProfileLayout>
    );
  } catch (error) {
    console.error("Error fetching public profile data:", error);
    notFound();
  }
}

export async function generateMetadata(props: PublicProfilePageProps) {
  const params = await props.params;
  const { slug, locale } = params;

  try {
    const profile = await getPublicProfile(slug, locale);
    return {
      title: `${profile.name} - GAMO`,
      description: profile.description || "Coleção de games e consoles",
    };
  } catch {
    return {
      title: "Perfil não encontrado",
      description: "O perfil que você está procurando não existe ou foi removido",
    };
  }
}
