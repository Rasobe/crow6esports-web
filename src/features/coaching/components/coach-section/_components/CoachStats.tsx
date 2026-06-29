import { useTranslations } from "next-intl";

type Stat = { value: string; label: string };

export function CoachStats() {
    const t = useTranslations("coaching.coach");
    const stats = t.raw("stats") as Stat[];

    return (
        <div className="coach-profile__stats">
            {stats.map((stat) => (
                <div key={stat.label} className="coach-profile__stat">
                    <span className="coach-profile__stat-value">{stat.value}</span>
                    <span className="coach-profile__stat-label">{stat.label}</span>
                </div>
            ))}
        </div>
    );
}
