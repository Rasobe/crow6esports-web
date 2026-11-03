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

test("plays the jersey video muted and lets the user pause it", async ({ page }) => {
  await page.goto("/es/store", { waitUntil: "networkidle" });

  const video = page.locator("jersey-gallery video");
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveJSProperty("muted", true);
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBe(false);

  await page.getByRole("button", { name: "Pausar vídeo" }).click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(page.getByRole("button", { name: "Reproducir vídeo" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("switches the store stage between the video and the product photos", async ({ page }) => {
  await page.goto("/es/store", { waitUntil: "networkidle" });

  const video = page.locator("jersey-gallery video");
  await video.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBe(false);

  await page.getByRole("tab", { name: "Frente" }).click();
  await expect(page.getByRole("tab", { name: "Frente" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel").locator("img:visible")).toHaveCount(1);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);

  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Espalda" })).toHaveAttribute("aria-selected", "true");

  await page.getByRole("tab", { name: "Vídeo" }).click();
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBe(false);
});
