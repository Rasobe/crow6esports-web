import clsx from "clsx";

type BadgeVariant = "default" | "brand" | "success" | "warning" | "danger";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: "rgba(255,255,255,0.08)", color: "var(--text-secondary)" },
  brand:   { background: "rgba(245,184,0,0.15)",   color: "var(--brand)" },
  success: { background: "rgba(52,211,153,0.15)",  color: "#6ee7b7" },
  warning: { background: "rgba(251,191,36,0.15)",  color: "#fcd34d" },
  danger:  { background: "rgba(239,68,68,0.15)",   color: "#fca5a5" },
};

export function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
        className
      )}
      style={variantStyles[variant]}
    >
      {label}
    </span>
  );
}
