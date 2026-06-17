import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";

interface CTAButtonBase {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

interface CTAButtonAsLink extends CTAButtonBase {
  href: string;
  onClick?: never;
}

interface CTAButtonAsButton extends CTAButtonBase {
  href?: never;
  onClick: () => void;
}

type CTAButtonProps = CTAButtonAsLink | CTAButtonAsButton;

export function CTAButton({ children, icon, className, href, onClick }: CTAButtonProps) {
  const content = (
    <>
      {icon && <span className="cta-button__icon" aria-hidden>{icon}</span>}
      {children}
    </>
  );

  const classes = clsx("cta-button", className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
