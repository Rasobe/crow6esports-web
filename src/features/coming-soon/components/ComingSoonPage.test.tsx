import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComingSoonPage } from "./ComingSoonPage";
import { socialLinks } from "@config/site";

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

describe("ComingSoonPage", () => {
  it("renders the Crow 6 Esports logo", () => {
    render(<ComingSoonPage />);
    const logo = screen.getByAltText("Crow 6 Esports");
    expect(logo).toHaveAttribute("src", "/images/brand/crow6-wordmark.svg");
  });

  it("renders the eyebrow, title and description", () => {
    render(<ComingSoonPage />);
    expect(screen.getByText("Estamos preparando algo")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1 }).textContent?.replace(/\s+/g, ""),
    ).toBe("PRÓXIMAMENTE");
    expect(
      screen.getByText(
        "Estamos trabajando en una nueva experiencia para Crow 6 Esports. Vuelve pronto.",
      ),
    ).toBeInTheDocument();
  });

  it("renders a social link for every entry in the site's social config", () => {
    render(<ComingSoonPage />);
    for (const social of socialLinks) {
      const link = screen.getByLabelText(social.label);
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
