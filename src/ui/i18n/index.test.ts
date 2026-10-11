import { describe, expect, it } from "vitest";
import { createTranslator, detectLocale, isLocale, localizePath, stripLocale } from "./index";

describe("isLocale", () => {
  it("accepts supported locales only", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe("detectLocale", () => {
  it("prefers Spanish when the header starts with es", () => {
    expect(detectLocale("es-ES,es;q=0.9")).toBe("es");
  });

  it("falls back to English otherwise", () => {
    expect(detectLocale("fr-FR")).toBe("en");
    expect(detectLocale(null)).toBe("en");
  });
});

describe("localizePath / stripLocale", () => {
  it("prefixes paths with the locale", () => {
    expect(localizePath("es", "/")).toBe("/es");
    expect(localizePath("en", "/team")).toBe("/en/team");
  });

  it("removes the locale prefix", () => {
    expect(stripLocale("/es")).toBe("/");
    expect(stripLocale("/en/team")).toBe("/team");
    expect(stripLocale("/team")).toBe("/team");
  });
});

describe("createTranslator", () => {
  it("resolves nested keys within a namespace", () => {
    expect(createTranslator("es", "team")("sections.active")).toBe("Jugadores activos");
    expect(createTranslator("en", "team")("sections.active")).toBe("Active players");
  });

  it("returns the full path when the key is missing", () => {
    expect(createTranslator("es", "team")("missing")).toBe("team.missing");
  });

  it("interpolates params", () => {
    const t = createTranslator("es", "tryouts.open");
    expect(t("step_of", { current: 1, total: 3 })).toBe("Paso 1 de 3");
  });
});
