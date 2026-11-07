import { describe, expect, it } from "vitest";
import { buildAttribution, captureAttribution } from "./attribution";

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    data,
  };
}

describe("buildAttribution", () => {
  it("reads the page path, the external referrer and the utm parameters", () => {
    expect(
      buildAttribution({
        href: "https://crow6esports.com/es/coaching?utm_source=Instagram&utm_medium=social&utm_campaign=launch&token=secret",
        referrer: "https://l.instagram.com/some/path?u=private#frag",
      }),
    ).toEqual({
      sourcePage: "/es/coaching",
      referrer: "https://l.instagram.com/some/path",
      utmSource: "instagram",
      utmMedium: "social",
      utmCampaign: "launch",
    });
  });

  it("never keeps query strings, hashes or unknown parameters", () => {
    const result = buildAttribution({
      href: "https://crow6esports.com/es?email=a@b.com#x",
      referrer: "https://example.com/p?id=42",
    });

    expect(JSON.stringify(result)).not.toMatch(/email|a@b\.com|id=42|#x/);
  });

  it("ignores empty referrers and links from the site itself", () => {
    const href = "https://crow6esports.com/es";

    expect(buildAttribution({ href, referrer: "" }).referrer).toBeUndefined();
    expect(
      buildAttribution({ href, referrer: "https://crow6esports.com/en" }).referrer,
    ).toBeUndefined();
    expect(buildAttribution({ href, referrer: "not a url" }).referrer).toBeUndefined();
  });

  it("truncates values to the limits the server accepts", () => {
    const result = buildAttribution({
      href: `https://crow6esports.com/${"p".repeat(300)}?utm_source=${"s".repeat(300)}`,
      referrer: `https://example.com/${"r".repeat(900)}`,
    });

    expect(result.sourcePage).toHaveLength(200);
    expect(result.referrer).toHaveLength(500);
    expect(result.utmSource).toHaveLength(100);
  });

  it("returns nothing for an invalid address", () => {
    expect(buildAttribution({ href: "nope", referrer: "" })).toEqual({});
  });
});

describe("captureAttribution", () => {
  const first = { href: "https://crow6esports.com/es?utm_source=discord", referrer: "" };
  const later = { href: "https://crow6esports.com/es/tryouts", referrer: "" };

  it("stores the first visit of the session", () => {
    const storage = fakeStorage();

    const attribution = captureAttribution(first, storage);

    expect(attribution).toMatchObject({ sourcePage: "/es", utmSource: "discord" });
    expect(JSON.parse(storage.data.get("crow6.attribution")!)).toMatchObject({ sourcePage: "/es" });
  });

  it("keeps the first visit when the visitor navigates on", () => {
    const storage = fakeStorage();
    captureAttribution(first, storage);

    expect(captureAttribution(later, storage)).toMatchObject({
      sourcePage: "/es",
      utmSource: "discord",
    });
  });

  it("falls back to the current page without storage or when it throws", () => {
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };

    expect(captureAttribution(later, null).sourcePage).toBe("/es/tryouts");
    expect(captureAttribution(later, blocked).sourcePage).toBe("/es/tryouts");
  });

  it("ignores corrupt or tampered stored values", () => {
    const corrupt = fakeStorage({ "crow6.attribution": "{not json" });
    const tampered = fakeStorage({
      "crow6.attribution": JSON.stringify({ sourcePage: 42, evil: "x", utmSource: "ok" }),
    });

    expect(captureAttribution(later, corrupt).sourcePage).toBe("/es/tryouts");
    expect(captureAttribution(later, tampered)).toEqual({ utmSource: "ok" });
  });
});
