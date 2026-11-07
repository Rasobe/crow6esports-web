import { describe, expect, it, vi } from "vitest";
import type { TryoutApplication } from "@/domain/tryouts/tryout-application";
import type { TryoutNotifier } from "@/domain/tryouts/tryout-notifier";
import type { TryoutRepository } from "@/domain/tryouts/tryout-repository";
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

const payload = { ...application, locale: "es" };

const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request(`${ORIGIN}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN, ...headers },
    body: JSON.stringify(body),
  });

function setup({
  limit = 5,
  notify = vi.fn().mockResolvedValue(undefined),
  save = vi.fn().mockResolvedValue(undefined),
} = {}) {
  const notifier: TryoutNotifier = { notify };
  const repository: TryoutRepository = { save };
  const handle = createContactHandler({
    limiter: createRateLimiter({ limit, windowMs: 60_000 }),
    getRepository: () => repository,
    getNotifier: () => notifier,
  });
  return { handle, notify, save };
}

describe("contact handler", () => {
  it("stores a valid application and then notifies", async () => {
    const { handle, save, notify } = setup();

    const response = await handle(request(payload), CLIENT);

    expect(response.status).toBe(200);
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ discord: "player_one" }), "es", {
      sourcePage: undefined,
      referrer: undefined,
      utmSource: undefined,
      utmMedium: undefined,
      utmCampaign: undefined,
    });
    expect(save.mock.calls[0][0]).not.toHaveProperty("locale");
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ discord: "player_one" }));
  });

  it("stores the attribution apart from the application", async () => {
    const { handle, save, notify } = setup();
    const attribution = {
      sourcePage: "/es/coaching",
      referrer: "https://www.instagram.com/",
      utmSource: "instagram",
      utmMedium: "social",
      utmCampaign: "launch",
    };

    const response = await handle(request({ ...payload, ...attribution }), CLIENT);

    expect(response.status).toBe(200);
    expect(save).toHaveBeenCalledWith(expect.anything(), "es", attribution);
    for (const field of Object.keys(attribution)) {
      expect(save.mock.calls[0][0]).not.toHaveProperty(field);
      expect(notify.mock.calls[0][0]).not.toHaveProperty(field);
    }
  });

  it("rejects attribution fields longer than their limit without storing", async () => {
    const { handle, save } = setup();

    const response = await handle(request({ ...payload, utmSource: "x".repeat(101) }), CLIENT);

    expect(response.status).toBe(400);
    expect(save).not.toHaveBeenCalled();
  });

  it("rejects requests from another site", async () => {
    const { handle, notify } = setup();

    const response = await handle(request(payload, { Origin: "https://evil.example" }), CLIENT);

    expect(response.status).toBe(403);
    expect(notify).not.toHaveBeenCalled();
  });

  it("rejects invalid applications without notifying", async () => {
    const { handle, notify } = setup();

    const response = await handle(request({ ...payload, discord: "" }), CLIENT);

    expect(response.status).toBe(400);
    expect(notify).not.toHaveBeenCalled();
  });

  it("pretends to accept submissions that filled the honeypot", async () => {
    const { handle, notify } = setup();

    const response = await handle(request({ ...payload, [HONEYPOT_FIELD]: "spam" }), CLIENT);

    expect(response.status).toBe(200);
    expect(notify).not.toHaveBeenCalled();
  });

  it("limits repeated submissions from the same client", async () => {
    const { handle } = setup({ limit: 1 });

    await handle(request(payload), CLIENT);
    const response = await handle(request(payload), CLIENT);

    expect(response.status).toBe(429);
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("fails clearly and sends no email when the insert fails", async () => {
    const { handle, notify } = setup({ save: vi.fn().mockRejectedValue(new Error("db down")) });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await handle(request(payload), CLIENT);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "persist_failed" });
    expect(notify).not.toHaveBeenCalled();
  });

  it("succeeds and logs the error when only the email fails", async () => {
    const { handle, save } = setup({ notify: vi.fn().mockRejectedValue(new Error("Resend down")) });
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await handle(request(payload), CLIENT);

    expect(response.status).toBe(200);
    expect(save).toHaveBeenCalledOnce();
    expect(logged).toHaveBeenCalled();
  });

  it("neither stores nor notifies invalid or spam submissions", async () => {
    const { handle, save } = setup();

    await handle(request({ ...payload, locale: "fr" }), CLIENT);
    await handle(request({ ...payload, [HONEYPOT_FIELD]: "spam" }), CLIENT);

    expect(save).not.toHaveBeenCalled();
  });
});
