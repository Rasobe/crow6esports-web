import { describe, expect, it } from "vitest";
import { applySecurityHeaders, createSecurityHeaders } from "./security-headers";

describe("applySecurityHeaders", () => {
  it("adds every security header to the response", () => {
    const response = applySecurityHeaders(new Response("ok"));

    for (const [name, value] of Object.entries(createSecurityHeaders())) {
      expect(response.headers.get(name)).toBe(value);
    }
  });

  it("keeps a header that the response already defines", () => {
    const response = applySecurityHeaders(
      new Response("ok", { headers: { "X-Frame-Options": "SAMEORIGIN" } }),
    );

    expect(response.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
  });
});

describe("Content-Security-Policy", () => {
  const policyFor = (isDev: boolean) => createSecurityHeaders(isDev)["Content-Security-Policy"];

  it("only allows the site itself, the YouTube player and the analytics in production", () => {
    const policy = policyFor(false);

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self' 'unsafe-inline' https://analytics.ahrefs.com;");
    expect(policy).toContain("connect-src 'self' https://analytics.ahrefs.com;");
    expect(policy).toContain("frame-src https://www.youtube-nocookie.com");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).not.toContain("vercel");
  });

  it("allows the Vercel debug scripts only in development", () => {
    expect(policyFor(true)).toContain("https://cdn.vercel-insights.com");
  });
});

describe("Content-Security-Policy of the Keystatic panel", () => {
  const panelPolicy = createSecurityHeaders(false, true)["Content-Security-Policy"];
  const sitePolicy = createSecurityHeaders(false, false)["Content-Security-Policy"];

  it("lets the panel reach the GitHub API and show repository images", () => {
    expect(panelPolicy).toContain("connect-src 'self' https://api.github.com");
    expect(panelPolicy).toContain("https://avatars.githubusercontent.com");
  });

  it("lets the panel read news content and images from raw.githubusercontent.com", () => {
    expect(panelPolicy).toMatch(/connect-src [^;]*https:\/\/raw\.githubusercontent\.com/);
    expect(panelPolicy).toMatch(/img-src [^;]*https:\/\/raw\.githubusercontent\.com/);
  });

  it("does not use unsafe-eval or wildcards", () => {
    expect(panelPolicy).not.toContain("unsafe-eval");
    expect(panelPolicy).not.toMatch(/(^|\s)\*(\s|;|$)/);
  });

  it("lets the panel load its Inter typeface from Google Fonts", () => {
    expect(panelPolicy).toMatch(/style-src [^;]*https:\/\/fonts\.googleapis\.com/);
    expect(panelPolicy).toMatch(/font-src [^;]*https:\/\/fonts\.gstatic\.com/);
  });

  it("lets the setup wizard submit its form to github.com to create the GitHub App", () => {
    expect(panelPolicy).toContain("form-action 'self' https://github.com");
  });

  it("keeps the analytics out of the panel", () => {
    expect(panelPolicy).not.toContain("analytics.ahrefs.com");
  });

  it("keeps the public site locked to its own origin", () => {
    expect(sitePolicy).toContain("form-action 'self';");
    expect(sitePolicy).not.toContain("github");
    expect(sitePolicy).not.toContain("google");
    expect(sitePolicy).not.toContain("raw.githubusercontent.com");
    expect(sitePolicy).toContain("connect-src 'self'");
  });
});
