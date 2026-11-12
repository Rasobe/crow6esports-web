import { AHREFS_ANALYTICS } from "@config/analytics";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import AhrefsAnalytics from "./AhrefsAnalytics.astro";

const SCRIPT = `<script src="https://analytics.ahrefs.com/analytics.js" data-key="${AHREFS_ANALYTICS.key}" async>`;

async function render(enabled: boolean, pathname: string) {
  const container = await AstroContainer.create();
  return container.renderToString(AhrefsAnalytics, {
    props: { enabled },
    request: new Request(`https://crow6esports.com${pathname}`),
  });
}

describe("AhrefsAnalytics", () => {
  it("adds the script on public pages when enabled (production)", async () => {
    expect(await render(true, "/es")).toContain(SCRIPT);
    expect(await render(true, "/en/coaching")).toContain(SCRIPT);
  });

  it.each(["/admin", "/admin/tryouts", "/admin/login", "/keystatic", "/login"])(
    "leaves it out of %s",
    async (pathname) => {
      expect(await render(true, pathname)).not.toContain("analytics.ahrefs.com");
    },
  );

  it("leaves it out everywhere when disabled", async () => {
    expect(await render(false, "/es")).not.toContain("analytics.ahrefs.com");
  });
});
