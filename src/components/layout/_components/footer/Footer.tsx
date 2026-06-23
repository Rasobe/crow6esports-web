import "./footer.scss";
import { FooterBottom, FooterBrand, FooterContact, FooterNav } from "./_components";

export function Footer() {
  return (
    <footer
      className="px-8 py-16"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-surface)",
      }}
    >
      <div
        className="mx-auto flex flex-col gap-12"
        style={{ maxWidth: "var(--container)" }}
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <FooterBrand />
          <FooterNav />
          <FooterContact />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}