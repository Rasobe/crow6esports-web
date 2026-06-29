import "./coach-section.scss";
import { WorkedWithSection, BioSection } from "./components";

export function CoachSection() {
    return (
        <section className="coach-section">
            <div className="coach-section__inner">
                <BioSection />
                <WorkedWithSection />
            </div>
        </section>
    )
}