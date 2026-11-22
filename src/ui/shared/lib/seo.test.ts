import { CLUB } from "@config/club";
import { siteConfig } from "@config/site";
import { describe, expect, it } from "vitest";
import { createTranslator, LOCALES, type Locale } from "@/ui/i18n";
import { buildPageTitle } from "./seo";

describe("buildPageTitle", () => {
  it("appends the brand to a page title", () => {
    expect(buildPageTitle("Plantilla", "Crow 6 eSports")).toBe("Plantilla · Crow 6 eSports");
  });

  it("uses an absolute title as it is", () => {
    expect(buildPageTitle("Crow 6 eSports · Organización", "Crow 6 eSports", true)).toBe(
      "Crow 6 eSports · Organización",
    );
  });

  it("falls back to the brand alone", () => {
    expect(buildPageTitle(undefined, "Crow 6 eSports")).toBe("Crow 6 eSports");
  });

  it("does not repeat the brand when the title already names it", () => {
    const headline = "Crow 6 eSports cae en el día 2 de la RLCS Club Kick-Off Open";
    expect(buildPageTitle(headline, "Crow 6 eSports")).toBe(headline);
  });
});

const PAGES = [
  { namespace: "home", absolute: true },
  { namespace: "team", absolute: false },
  { namespace: "news", absolute: false },
  { namespace: "store", absolute: false },
  { namespace: "tryouts", absolute: false },
  { namespace: "coaching", absolute: false },
  { namespace: "about", absolute: false },
] as const;

const PARAMS = { year: CLUB.foundedYear, city: CLUB.location.city, years: 6, price: "40 €" };

// Tryouts cambia de título según estén abiertos o cerrados, y la tienda de descripción
// según haya stock: las dos variantes tienen que cumplir los mismos límites.
const TITLE_KEYS: Record<string, readonly string[]> = { tryouts: ["title", "title_closed"] };
const DESCRIPTION_KEYS: Record<string, readonly string[]> = {
  store: ["description", "description_in_stock"],
};

function metadataOf(locale: Locale) {
  return PAGES.flatMap(({ namespace, absolute }) => {
    const t = createTranslator(locale, `${namespace}.seo`);
    const titles = (TITLE_KEYS[namespace] ?? ["title"]).map((key) =>
      buildPageTitle(t(key), siteConfig.name, absolute),
    );
    const descriptions = (DESCRIPTION_KEYS[namespace] ?? ["description"]).map((key) =>
      t(key, PARAMS),
    );
    return titles.flatMap((title) =>
      descriptions.map((description) => ({ namespace, title, description })),
    );
  });
}

const countKeys = (keys: Record<string, readonly string[]>) =>
  PAGES.reduce((total, { namespace }) => total + (keys[namespace]?.length ?? 1), 0);

const TITLE_COUNT = countKeys(TITLE_KEYS);
const DESCRIPTION_COUNT = countKeys(DESCRIPTION_KEYS);

describe.each(LOCALES)("page metadata (%s)", (locale) => {
  const pages = metadataOf(locale);

  it("keeps every title between 50 and 60 characters", () => {
    for (const { namespace, title } of pages) {
      expect(title.length, `${namespace}: ${title}`).toBeGreaterThanOrEqual(50);
      expect(title.length, `${namespace}: ${title}`).toBeLessThanOrEqual(60);
    }
  });

  it("keeps every description between 120 and 160 characters", () => {
    for (const { namespace, description } of pages) {
      expect(description.length, `${namespace}: ${description}`).toBeGreaterThanOrEqual(120);
      expect(description.length, `${namespace}: ${description}`).toBeLessThanOrEqual(160);
    }
  });

  it("gives each page its own title and description", () => {
    const titles = new Set(pages.map((page) => page.title));
    const descriptions = new Set(pages.map((page) => page.description));
    expect(titles.size).toBe(TITLE_COUNT);
    expect(descriptions.size).toBe(DESCRIPTION_COUNT);
  });

  it("does not use Inicio or Home as a title and always names the brand", () => {
    for (const { title } of pages) {
      expect(title).not.toMatch(/^(Inicio|Home)\b/);
      expect(title).toContain("Crow 6 eSports");
    }
  });

  it("never promises a purchase while the store is sold out", () => {
    const soldOut = createTranslator(locale, "store.seo")("description");
    expect(soldOut).toMatch(/agotada|sold out/);
  });
});

describe("home metadata", () => {
  it("uses the Spanish and English titles of the brief", () => {
    expect(createTranslator("es", "home.seo")("title")).toBe(
      "Crow 6 eSports | Organización y coaching de Rocket League",
    );
    expect(createTranslator("en", "home.seo")("title")).toBe(
      "Crow 6 eSports | Rocket League Organization & Coaching",
    );
  });

  it.each(LOCALES)("starts the %s description with the full brand name", (locale) => {
    expect(createTranslator(locale, "home.seo")("description", PARAMS)).toMatch(
      /^Crow 6 eSports\b/,
    );
  });
});
