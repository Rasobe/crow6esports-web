import { expect, test } from "@playwright/test";

test("loads the YouTube player only after pressing play", async ({ page }) => {
  await page.goto("/es", { waitUntil: "networkidle" });

  const player = page.locator("video-player");
  await player.scrollIntoViewIfNeeded();
  await expect(player.locator("iframe")).toHaveCount(0);

  await player.getByRole("button").click();

  const frame = player.locator("iframe");
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute(
    "src",
    /^https:\/\/www\.youtube-nocookie\.com\/embed\/.+autoplay=1/,
  );
});
