import "./roster-section.scss";

import { PlayerCard } from "@/components/ui";
import { Player } from "@/types";

interface RosterSectionProps {
    title: string;
    players: Player[];
}

export function RosterSection({ title, players }: RosterSectionProps) {
    if (players.length === 0) return null;

    return (
        <section className="roster-section">
            <div className="roster-section__inner">
                <h2 className="roster-section__title">{title}</h2>

                <ul className="roster-section__list">
                    {players.map((player) => (
                        <li key={player.id} className="roster-section__list-item">
                            <PlayerCard player={player} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}