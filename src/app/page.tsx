// app/page.tsx
import { HeroSection, TeamHighlight, LatestNews } from "@/features/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TeamHighlight />
      <LatestNews />
    </>
  );
}
