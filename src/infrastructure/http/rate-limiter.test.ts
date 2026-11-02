import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limiter";

describe("createRateLimiter", () => {
  it("allows hits up to the limit and then blocks with the remaining wait", () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1_000, now: () => time });

    expect(limiter.hit("ip")).toBe(0);
    time = 100;
    expect(limiter.hit("ip")).toBe(0);
    time = 400;
    expect(limiter.hit("ip")).toBe(600);
  });

  it("allows hits again once the window has passed", () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000, now: () => time });

    limiter.hit("ip");
    time = 1_000;
    expect(limiter.hit("ip")).toBe(0);
  });

  it("tracks each key independently", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1_000, now: () => 0 });

    limiter.hit("a");
    expect(limiter.hit("b")).toBe(0);
  });
});
