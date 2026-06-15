import { Link } from "@/i18n/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface NavLinksProps {
  links: readonly NavLink[];
}

export function NavLinks({ links }: NavLinksProps) {
  return (
    <ul className="navbar__links">
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className="navbar__link">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
