import clsx from "clsx";
import "./badge.scss";

type BadgeVariant = "default" | "brand" | "success" | "warning" | "danger";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ label, variant = "default", className }: BadgeProps) {
  return (
    <span className={clsx("badge", `badge--${variant}`, className)}>
      {label}
    </span>
  );
}
