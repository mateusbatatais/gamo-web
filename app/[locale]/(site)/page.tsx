import HomeTemplate from "@/components/templates/Home/HomeTemplate";
import { getServerSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession();
  return <HomeTemplate userSlug={session?.slug} />;
}
