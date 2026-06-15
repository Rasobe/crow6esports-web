import Link from "next/link";
import { siteConfig } from "@config/site";

export function Footer() {
  return (
    <footer
      className="px-6 py-12 text-center"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-surface)",
      }}
    >
      <div
        className="mx-auto flex flex-col items-center gap-4"
        style={{ maxWidth: "var(--container)" }}
      >
        <p className="nav-brand">{siteConfig.name}</p>

        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          {siteConfig.description}
        </p>

        <div className="flex gap-5 text-sm">
          {Object.entries(siteConfig.socials).map(([name, url]) => (
            <Link
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {name}
            </Link>
          ))}
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
