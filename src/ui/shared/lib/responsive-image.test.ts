import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import products from "@content/stock.json";
import { storeImageSrcset, storeImageVariants } from "./responsive-image";

describe("storeImageSrcset", () => {
  it("lists the width variants of an image", () => {
    expect(storeImageSrcset("/images/store/jersey.webp")).toBe(
      "/images/store/jersey-400.webp 400w, /images/store/jersey-560.webp 560w, /images/store/jersey-720.webp 720w",
    );
  });

  it("has every variant generated for the store images", () => {
    const images = products.flatMap((product) => product.images);
    for (const variant of images.flatMap(storeImageVariants)) {
      expect(existsSync(`public${variant}`), variant).toBe(true);
    }
  });
});
