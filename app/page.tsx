import ReactQueryProvider from "@/components/ReactQueryProvider";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturedCampaignsSection } from "@/components/landing/FeaturedCampaignsSection";

export default function Home() {
  return (
    <ReactQueryProvider>
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedCampaignsSection />
      </main>
    </ReactQueryProvider>
  );
}
