import { describe, expect, it } from "vitest";
import {
  createMessageTranslator,
  createTranslator,
  detectLocale,
  getMessages,
  isLocale,
  localizePath,
  stripLocale,
} from "./index";
import en from "./locales/en.json";
import es from "./locales/es.json";

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

  it("ignores trailing slashes", () => {
    expect(stripLocale("/es/team/")).toBe("/team");
    expect(stripLocale("/es/")).toBe("/");
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
    const t = createMessageTranslator({ step_of: "Step {current} of {total}" });
    expect(t("step_of", { current: 1, total: 3 })).toBe("Step 1 of 3");
    expect(t("step_of", { current: 1 })).toBe("Step 1 of {total}");
  });
});

describe("getMessages", () => {
  it("returns a namespace slice usable by client translators", () => {
    const t = createMessageTranslator(getMessages("en", "tryouts.open"), "form");
    expect(t("back")).toBe("Back");
  });
});

type MessageTree = { [key: string]: string | MessageTree };

function collectKeys(tree: MessageTree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : collectKeys(value, path);
  });
}

describe("locales", () => {
  it("expose exactly the same keys in es and en", () => {
    const esKeys = collectKeys(es).sort();
    const enKeys = collectKeys(en).sort();

    expect(enKeys).toEqual(esKeys);
  });
});
