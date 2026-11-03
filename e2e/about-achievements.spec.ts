import { expect, test } from "@playwright/test";

const LINKS = [
  {
    event: "SFL Master Series",
    label: /Ver el vídeo/,
    href: "https://www.youtube.com/watch?v=zaoPw_G9aSc",
  },
  {
    event: "Gamergy Amazon",
    label: /Ver en Liquipedia/,
    href: "https://liquipedia.net/rocketleague/Gamergy/Amazon_GAMERGY/2022/Liga_Road_to_Gamergy",
  },
];

test.describe("achievement links on the about page", () => {
  for (const { event, label, href } of LINKS) {
    test(`links ${event} to its source in a new tab`, async ({ page }) => {
      await page.goto("/es/about-us", { waitUntil: "networkidle" });

      const card = page.locator(".timeline__card", {
        has: page.getByRole("heading", { name: event }),
      });
      const link = card.getByRole("link", { name: label });

      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    });
  }

  test("does not add a link to the achievement that has no source", async ({ page }) => {
    await page.goto("/es/about-us", { waitUntil: "networkidle" });

    const card = page.locator(".timeline__card", {
      has: page.getByRole("heading", { name: "Ranking europeo" }),
    });
    await expect(card.locator(".timeline__link")).toHaveCount(0);
  });
});
