import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SOURCE_ROOTS = ["src/ui", "src/pages"];

const astroFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return astroFiles(path);
    return path.endsWith(".astro") ? [path] : [];
  });

describe("img elements in the Astro sources", () => {
  it("always declare an alt attribute, empty when the image is decorative", () => {
    const missing = SOURCE_ROOTS.flatMap(astroFiles).flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(/<img\b[^>]*>/gs)]
        .filter(([tag]) => !/\salt(=|\s|\/?>)/.test(tag))
        .map(([tag]) => `${file}: ${tag.replace(/\s+/g, " ").slice(0, 80)}`),
    );

    expect(missing).toEqual([]);
  });
});
