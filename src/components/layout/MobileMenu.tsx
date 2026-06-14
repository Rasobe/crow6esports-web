"use client";

import { useState, useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  links: readonly NavLink[];
  joinLabel: string;
}

export function MobileMenu({ links, joinLabel }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="mobile-menu__trigger md:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? (
          <X size={22} strokeWidth={1.5} />
        ) : (
          <Menu size={22} strokeWidth={1.5} />
        )}
      </button>

      {isOpen && (
        <div
          className="mobile-menu__overlay"
          aria-hidden
          onClick={() => setIsOpen(false)}
        />
      )}

      <dialog
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu__drawer ${isOpen ? "mobile-menu__drawer--open" : ""}`}
        aria-label="Menú de navegación"
      >
        <nav>
          <ul className="mobile-menu__links" role="list">
            {links.map(({ href, label }) => {
              const isActive = pathname.includes(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`mobile-menu__link ${isActive ? "mobile-menu__link--active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link href="/tryouts" className="mobile-menu__cta">
            {joinLabel}
          </Link>
        </nav>
      </dialog>
    </>
  );
}
