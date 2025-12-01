import HeroSection from "@/components/organisms/Home/HeroSection";
import MarketplaceHighlights from "@/components/organisms/Home/MarketplaceHighlights";
import CommunitySpotlight from "@/components/organisms/Home/CommunitySpotlight";
import DiscoverySection from "@/components/organisms/Home/DiscoverySection";

export default function HomeTemplate() {
  return (
    <div className="space-y-12">
      <HeroSection />
      <MarketplaceHighlights />
      <CommunitySpotlight />
      <DiscoverySection />
    </div>
  );
}
