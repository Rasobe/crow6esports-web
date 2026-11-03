import { describe, expect, it, vi } from "vitest";
import type { TryoutApplication } from "@/domain/tryouts/tryout-application";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import { createRateLimiter } from "@/infrastructure/http/rate-limiter";
import { createContactHandler, HONEYPOT_FIELD } from "./contact-handler";

const ORIGIN = "https://crow6esports.com";
const CLIENT = "203.0.113.7";

const application: TryoutApplication = {
  discord: "player_one",
  birthDate: "2005-06-15",
  country: "España",
  availableDays: ["mon", "wed"],
  scheduleType: "flexible",
  rltracker: "https://rocketleague.tracker.network/profile/1",
  rank: "1800",
  peak: "2000",
  hoursPlayed: 3000,
  playstyle: "calm",
  hasCompetitiveExp: "no",
  reactionToMistakes: "I stay calm and talk it through",
  reactionToLosses: "calm",
  lookingFor: "A serious competitive environment",
  openToCoaching: "yes",
};

const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request(`${ORIGIN}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN, ...headers },
    body: JSON.stringify(body),
  });

function setup({ limit = 5, notify = vi.fn().mockResolvedValue(undefined) } = {}) {
  const notifier: TryoutNotifier = { notify };
  const handle = createContactHandler({
    limiter: createRateLimiter({ limit, windowMs: 60_000 }),
    getNotifier: () => notifier,
  });
  return { handle, notify };
}

describe("contact handler", () => {
  it("delivers a valid application", async () => {
    const { handle, notify } = setup();

    const response = await handle(request(application), CLIENT);

    expect(response.status).toBe(200);
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ discord: "player_one" }));
  });

  it("rejects requests from another site", async () => {
    const { handle, notify } = setup();

    const response = await handle(request(application, { Origin: "https://evil.example" }), CLIENT);

    expect(response.status).toBe(403);
    expect(notify).not.toHaveBeenCalled();
  });

  it("rejects invalid applications without notifying", async () => {
    const { handle, notify } = setup();

    const response = await handle(request({ ...application, discord: "" }), CLIENT);

    expect(response.status).toBe(400);
    expect(notify).not.toHaveBeenCalled();
  });

  it("pretends to accept submissions that filled the honeypot", async () => {
    const { handle, notify } = setup();

    const response = await handle(request({ ...application, [HONEYPOT_FIELD]: "spam" }), CLIENT);

    expect(response.status).toBe(200);
    expect(notify).not.toHaveBeenCalled();
  });

  it("limits repeated submissions from the same client", async () => {
    const { handle } = setup({ limit: 1 });

    await handle(request(application), CLIENT);
    const response = await handle(request(application), CLIENT);

    expect(response.status).toBe(429);
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("reports a delivery failure when the email cannot be sent", async () => {
    const { handle } = setup({ notify: vi.fn().mockRejectedValue(new Error("Resend down")) });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await handle(request(application), CLIENT);

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "delivery_failed" });
  });
});
