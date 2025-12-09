import HeroSection from "@/components/organisms/Home/HeroSection";
import MarketplaceHighlights from "@/components/organisms/Home/MarketplaceHighlights";
import DiscoverySection from "@/components/organisms/Home/DiscoverySection";
import HomeMapSection from "@/components/organisms/Home/HomeMapSection";
import TopUsersSection from "@/components/organisms/Home/TopUsersSection";
import RecentActivitySection from "@/components/organisms/Home/RecentActivitySection";
import { PlayingNowSection } from "@/components/organisms/PublicProfile/PlayingNow/PlayingNowSection";

interface HomeTemplateProps {
  userSlug?: string;
}

export default function HomeTemplate({ userSlug }: HomeTemplateProps) {
  return (
    <main className="space-y-12">
      <HeroSection />
      {userSlug && (
        <div className=" mx-auto">
          <PlayingNowSection slug={userSlug} isOwner={true} />
        </div>
      )}
      <TopUsersSection type="COLLECTION" />
      <HomeMapSection />

      <MarketplaceHighlights />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivitySection />
        </div>
        <div className="lg:col-span-1">
          <DiscoverySection />
        </div>
      </div>
      <TopUsersSection type="SELLING" />
    </main>
  );
}
