import "./button.scss";
import { Link } from "@/i18n/navigation";
import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "outline" | "ghost" | "brand-outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBase {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icono opcional mostrado antes del texto */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBase> & {
    href?: never;
  };

type ButtonAsLink = ButtonBase &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBase | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = clsx("btn", `btn--${variant}`, `btn--${size}`, className);

  const content = (
    <>
      {icon && <span className="btn__icon" aria-hidden>{icon}</span>}
      {children}
    </>
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as ComponentPropsWithoutRef<"a">)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
