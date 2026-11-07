import { describe, expect, it } from "vitest";
import { pageRange, totalPages } from "./pagination";

describe("pagination", () => {
  it("always has at least one page", () => {
    expect(totalPages(0, 20)).toBe(1);
    expect(totalPages(20, 20)).toBe(1);
    expect(totalPages(21, 20)).toBe(2);
  });

  it("maps a 1-based page to an inclusive row range", () => {
    expect(pageRange(1, 20)).toEqual({ from: 0, to: 19 });
    expect(pageRange(3, 20)).toEqual({ from: 40, to: 59 });
  });
});
