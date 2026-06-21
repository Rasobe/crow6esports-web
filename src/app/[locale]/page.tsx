import { CoachingBanner, HeroSection, TeamHighlight } from "@/features/home";
import { createGenerateMetadata } from "@/components/seo/MetaTags";

export const generateMetadata = createGenerateMetadata("home", "");

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TeamHighlight />
      <CoachingBanner />
    </>
  );
}