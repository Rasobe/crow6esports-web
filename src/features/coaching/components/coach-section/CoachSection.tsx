import "./coach-section.scss";
import { BioSection } from "./components";

export function CoachSection() {
    return (
        <section className="coach-section">
            <div className="coach-section__inner">
                <BioSection />
                <div className="coach-section__achievements">

                </div>
            </div>
        </section>
    )
}