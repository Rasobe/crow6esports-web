import { SectionHeader } from "@/components/ui";
import { useTranslations } from "next-intl";
import { Crosshair, Users, TrendingUp, LucideIcon } from "lucide-react";
import "./services-section.scss";

const ICONS: Record<string, LucideIcon> = {
    crosshair: Crosshair,
    users: Users,
    "trending-up": TrendingUp,
};

export function ServicesSection() {
    const t = useTranslations("coaching.services");
    const items = t.raw("items") as { icon: string; title: string; features: string[] }[];

    return (
        <section className="services-section">
            <div className="services-section__inner">
                <SectionHeader namespace="coaching.services.meta" />

                <div className="services-section__grid">
                    {items.map((item) => {
                        const Icon = ICONS[item.icon];
                        return (
                            <div key={item.title} className="service-card">
                                <div className="service-card__icon">
                                    {Icon && <Icon size={22} />}
                                </div>
                                <h3 className="service-card__title">{item.title}</h3>
                                <ul className="service-card__features">
                                    {item.features.map((f) => (
                                        <li key={f} className="service-card__feature">{f}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}