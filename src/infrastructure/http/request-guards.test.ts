import { describe, expect, it } from "vitest";
import { isJsonRequest, isSameOrigin, readJsonBody } from "./request-guards";

const post = (body: string, headers: Record<string, string> = {}) =>
  new Request("https://crow6esports.com/api/contact", { method: "POST", body, headers });

describe("isJsonRequest", () => {
  it("accepts application/json with a charset", () => {
    expect(isJsonRequest(post("{}", { "content-type": "application/json; charset=utf-8" }))).toBe(
      true,
    );
  });

  it("rejects other content types", () => {
    expect(isJsonRequest(post("a=1", { "content-type": "text/plain" }))).toBe(false);
  });
});

describe("isSameOrigin", () => {
  it("accepts requests without an Origin header", () => {
    expect(isSameOrigin(post("{}"))).toBe(true);
  });

  it("accepts the site's own origin and rejects any other", () => {
    expect(isSameOrigin(post("{}", { origin: "https://crow6esports.com" }))).toBe(true);
    expect(isSameOrigin(post("{}", { origin: "https://evil.example" }))).toBe(false);
  });
});

describe("readJsonBody", () => {
  it("parses valid JSON", async () => {
    expect(await readJsonBody(post('{"a":1}'))).toEqual({ ok: true, value: { a: 1 } });
  });

  it("reports malformed JSON", async () => {
    expect(await readJsonBody(post("{nope"))).toEqual({ ok: false, reason: "invalid_json" });
  });

  it("rejects bodies over the limit", async () => {
    expect(await readJsonBody(post("x".repeat(100)), 10)).toEqual({
      ok: false,
      reason: "too_large",
    });
  });
});
