import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, style, children, ...props }, ref) => {
    const variantStyle: React.CSSProperties =
      variant === "primary"
        ? { background: "var(--brand)", color: "var(--brand-fg)" }
        : variant === "secondary"
        ? { border: "1px solid var(--border-strong)", color: "var(--text-primary)" }
        : { color: "var(--text-secondary)" };

    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex cursor-pointer items-center justify-center rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2",
          "disabled:cursor-not-allowed disabled:opacity-40",
          sizeClasses[size],
          className
        )}
        style={{ ...variantStyle, ...style }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
