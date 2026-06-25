import { useTranslations } from "next-intl"

interface FooterSectionTitleProps {
    value: string
}

export const FooterSectionTitle = ({ value }: FooterSectionTitleProps) => {
    const t = useTranslations('footer')

    return (
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {t(value)}
        </span>
    )
}