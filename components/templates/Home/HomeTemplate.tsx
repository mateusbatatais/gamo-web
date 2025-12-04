import HeroSection from "@/components/organisms/Home/HeroSection";
import MarketplaceHighlights from "@/components/organisms/Home/MarketplaceHighlights";
import CommunitySpotlight from "@/components/organisms/Home/CommunitySpotlight";
import DiscoverySection from "@/components/organisms/Home/DiscoverySection";
import HomeMapSection from "@/components/organisms/Home/HomeMapSection";
import TopUsersSection from "@/components/organisms/Home/TopUsersSection";

export default function HomeTemplate() {
  return (
    <div className="space-y-12">
      <HeroSection />
      <MarketplaceHighlights />
      <HomeMapSection />
      <TopUsersSection type="COLLECTION" />
      <TopUsersSection type="SELLING" />
      <CommunitySpotlight />
      <DiscoverySection />
    </div>
  );
}
