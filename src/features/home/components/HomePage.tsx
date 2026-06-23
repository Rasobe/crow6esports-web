import { CoachingBanner, HeroSection, StoreHighlight, TeamHighlight } from "@/features/home";

export function HomePage() {
    return (
        <>
            <HeroSection />
            <TeamHighlight />
            <CoachingBanner />
            <StoreHighlight />
        </>
    );
}