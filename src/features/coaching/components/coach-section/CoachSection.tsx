import "./coach-section.scss";
import { BioSection } from "./components";

export function CoachSection() {
    return (
        <section className="coach-section">
            <div className="coach-section__inner">
                <BioSection />
                {/* <AchievementsSection /> */}
            </div>
        </section>
    )
}