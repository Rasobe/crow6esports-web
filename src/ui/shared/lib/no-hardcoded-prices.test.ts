import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Un importe en euros escrito a mano ("49€", "€ 49", "49 EUR") se desincroniza de config/coaching.ts
const HARDCODED_PRICE = /\d\s?(€|EUR\b)|(€|EUR\b)\s?\d/;

const SOURCE_EXTENSIONS = /\.(astro|ts|tsx|json)$/;
const IGNORED = /\.test\.ts$/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return SOURCE_EXTENSIONS.test(name) && !IGNORED.test(name) ? [path] : [];
  });
}

describe("coaching prices", () => {
  it("are never written by hand outside config/coaching.ts", () => {
    const offenders = sourceFiles("src").filter((file) =>
      HARDCODED_PRICE.test(readFileSync(file, "utf8")),
    );

    expect(offenders).toEqual([]);
  });
});
