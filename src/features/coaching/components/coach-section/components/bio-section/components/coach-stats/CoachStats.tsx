import { useTranslations } from "next-intl";
import "./coach-stats.scss";

export function CoachStats() {
    const t = useTranslations("coaching.coach");
    const stats = t.raw("stats") as { value: string; label: string }[];

    return (
        <div className="coach-stats">
            {stats.map((stat) => (
                <div key={stat.label} className="coach-stats__item">
                    <span className="coach-stats__value">{stat.value}</span>
                    <span className="coach-stats__label">{stat.label}</span>
                </div>
            ))}
        </div>
    );
}