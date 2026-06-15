import Link from "next/link";
import { siteConfig } from "@config/site";
import { FooterBottom, FooterBrand, FooterContact, FooterNav } from "./_components";

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
        <div className="flex flex-row">
          <FooterBrand />
          <FooterContact />
          <FooterNav />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
