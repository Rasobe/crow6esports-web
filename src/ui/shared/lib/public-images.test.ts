import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const IMAGES_DIR = join(process.cwd(), "public", "images");
// Por encima de esto la imagen pesa en la carga y Ahrefs la marca; las portadas deben ir
// a 1200x630 en JPG por debajo de 200 KB
const MAX_BYTES = 300 * 1024;

const filesIn = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });

describe("public images", () => {
  it("keeps every file under public/images below 300 KB", () => {
    const oversized = filesIn(IMAGES_DIR)
      .map((path) => ({ path, kb: Math.round(statSync(path).size / 1024) }))
      .filter(({ kb }) => kb * 1024 > MAX_BYTES);

    expect(oversized).toEqual([]);
  });
});
