// app/[locale]/user/[slug]/page.tsx
import { notFound } from "next/navigation";
import { PublicProfileConsoleGrid } from "@/components/organisms/PublicProfile/PublicProfileConsoleGrid/PublicProfileConsoleGrid";
import { PublicProfileHeader } from "@/components/organisms/PublicProfile/PublicProfileHeader/PublicProfileHeader";
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <PublicProfileHeader profile={profile} />
          <div className="mt-8">
            <PublicProfileConsoleGrid consoles={consoles} />
          </div>
        </div>
      </div>
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
