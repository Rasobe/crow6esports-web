import Link from "next/link";
import { Bird } from "lucide-react";
import { siteConfig } from "@config/site";

const NAV_LINKS = [
  { href: "/team",    label: "Plantilla" },
  { href: "/news",    label: "Noticias"  },
  { href: "/store",   label: "Tienda"    },
  { href: "/tryouts", label: "Tryouts"   },
  { href: "/about",   label: "Nosotros"  },
] as const;

export function Navbar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        height: "var(--navbar-h)",
        background: "var(--bg-overlay)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <nav
        className="mx-auto flex h-full items-center justify-between px-6"
        style={{ maxWidth: "var(--container)" }}
      >
        {/* Logo */}
        <Link href="/" className="nav-brand flex items-center gap-2.5">
          <Bird
            size={26}
            strokeWidth={1.5}
            style={{ color: "var(--brand)", flexShrink: 0 }}
          />
          <div className="flex flex-col leading-none">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                letterSpacing: "0.06em",
                color: "var(--text-primary)",
              }}
            >
              CROW <span style={{ color: "var(--brand)" }}>6</span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: "var(--brand)",
                marginTop: "1px",
              }}
            >
              ESPORTS ORGANIZATION
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="nav-link">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="/tryouts" className="nav-cta hidden md:inline-flex">
          Únete
        </Link>
      </nav>
    </header>
  );
}
