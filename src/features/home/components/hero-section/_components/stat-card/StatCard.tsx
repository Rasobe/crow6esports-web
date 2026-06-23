interface StatCardProps {
    value: string | number;
    label: string;
}

export const StatCard = ({ value, label }: StatCardProps) => {
    return (
        <div className="hero__stat">
            <span className="hero__stat-num">{value}</span>
            <span className="hero__stat-label">{label}</span>
        </div>
    )
}
