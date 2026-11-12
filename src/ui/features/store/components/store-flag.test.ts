import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { afterEach, describe, expect, it, vi } from "vitest";

async function renderStore(storeEnabled: boolean) {
  vi.resetModules();
  vi.doMock("@config/store", () => ({ STORE_ENABLED: storeEnabled }));

  const { default: StorePage } = await import("./StorePage.astro");
  const container = await AstroContainer.create();
  return container.renderToString(StorePage, { locals: { locale: "es" } });
}

afterEach(() => vi.doUnmock("@config/store"));

describe("STORE_ENABLED", () => {
  it("false: shows the out of stock notice with Discord and Instagram, no purchase or prices", async () => {
    const html = await renderStore(false);

    expect(html).toContain("Sin stock por ahora");
    expect(html).toContain("Próximamente");
    expect(html).toContain("https://discord.com/invite/");
    expect(html).toContain("https://www.instagram.com/crow6esports");
    expect(html).toContain("jersey-video-poster");
    expect(html).not.toContain("Añadir al carrito");
    expect(html).not.toMatch(/€|\bEUR\b/);
  });

  it("true: shows the purchase catalog and not the out of stock notice", async () => {
    const html = await renderStore(true);

    expect(html).not.toContain("Sin stock por ahora");
    expect(html).toContain('class="store-catalog');
  });
});
