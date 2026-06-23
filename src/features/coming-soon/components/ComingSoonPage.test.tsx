import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComingSoonPage } from "./ComingSoonPage";

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
    expect(screen.getByText("Próximamente")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Estamos trabajando en una nueva experiencia para Crow 6 Esports. Vuelve pronto.",
      ),
    ).toBeInTheDocument();
  });
});
