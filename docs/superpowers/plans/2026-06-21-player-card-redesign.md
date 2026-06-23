# PlayerCard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up dead/broken `Player` model code, surface `stats.rank` and `socials.rltracker` in the `PlayerCard` component, fix a locale-formatting bug, and apply an "evolution of the current style" visual update (rank badge next to the role badge).

**Architecture:** No architectural change — `PlayerCard` stays a single client component in `src/components/ui/player-card/`. Pure logic (age calculation, active social link list) is extracted into a co-located `player-card.utils.ts` so it can be unit-tested without rendering. A new `vitest` setup is added to the repo (none existed) to support real TDD.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, next-intl, Sass. New: Vitest + @testing-library/react + jsdom for testing.

## Global Constraints

- TypeScript siempre; nunca `any` salvo que sea inevitable y justificado.
- Nombrado en inglés para variables, funciones, tipos y archivos.
- Sin `console.log` residuales.
- Exports nombrados; sin `default export` salvo páginas de ruta Next.js.
- Commits en formato Conventional Commits, en inglés, imperativo, máx. 72 caracteres en la primera línea.
- No instalar dependencias fuera de las explícitamente listadas en este plan (Vitest y su entorno de testing, ya aprobado por el usuario).
- No tocar `next.config.ts`, `tsconfig.json` paths, `.env*`, ni la estructura de carpetas más allá de lo descrito aquí.

---

## Task 1: Set up Vitest test runner

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/sanity.test.ts`
- Modify: `package.json` (add `test` script and devDependencies)

**Interfaces:**
- Produces: a working `npm test` command, a `vitest.config.ts` with aliases `@/` → `src/`, `@config/` → `config/`, `@content/` → `content/`, jsdom environment, and `@testing-library/jest-dom` matchers loaded globally. Later tasks rely on this config being present and working.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "./config"),
      "@content": path.resolve(__dirname, "./content"),
    },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add the `test` script to `package.json`**

In `package.json`, inside `"scripts"`, add:

```json
"test": "vitest run"
```

- [ ] **Step 5: Write a failing smoke test**

Create `src/sanity.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("vitest setup", () => {
  it("resolves the @/ alias", async () => {
    const { ROUTES } = await import("@config/routes");
    expect(ROUTES.home).toBe("/");
  });
});
```

- [ ] **Step 6: Run the test to verify the setup works**

Run: `npm test`
Expected: `1 passed` — this confirms jsdom, the `@config/*` alias, and the runner itself all work. (This step is a setup-verification check, not red/green TDD — there's no prior "failing" state to observe since the file didn't exist yet.)

- [ ] **Step 7: Delete the sanity test**

It was only there to prove the setup works; it doesn't test product code.

```bash
rm src/sanity.test.ts
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "chore: add vitest test runner"
```

---

## Task 2: Remove dead `features/team` stub code

**Files:**
- Delete: `src/features/team/components/PlayerCard.tsx`
- Delete: `src/features/team/components/RosterGrid.tsx`
- Delete: `src/features/team/` (and `src/features/team/components/`) if empty after the above

**Interfaces:** None — this code has zero consumers (verified: only self-references).

- [ ] **Step 1: Confirm there are no consumers**

Run: `grep -rn "features/team" --include="*.ts" --include="*.tsx" src`
Expected: no output (the only matches are inside the files being deleted, which `grep` on `src` excluding those two files won't show once deleted — run this before deleting to be sure nothing else imports them).

- [ ] **Step 2: Delete the stub files and empty directories**

```bash
rm src/features/team/components/PlayerCard.tsx
rm src/features/team/components/RosterGrid.tsx
rmdir src/features/team/components
rmdir src/features/team
```

- [ ] **Step 3: Verify the project still typechecks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A src/features/team
git commit -m "chore: remove unused team PlayerCard/RosterGrid stubs"
```

---

## Task 3: Make `PlayerStats.rank` required

**Files:**
- Modify: `src/types/Player.ts:16-20`

**Interfaces:**
- Produces: `PlayerStats.rank: string` (was `rank?: string`). Task 7's `PlayerCard` and its tests rely on `player.stats.rank` always being a defined `string`.

- [ ] **Step 1: Update the interface**

In `src/types/Player.ts`, change:

```ts
export interface PlayerStats {
  mmr: number;
  peak: number;
  rank?: string;
}
```

to:

```ts
export interface PlayerStats {
  mmr: number;
  peak: number;
  rank: string;
}
```

- [ ] **Step 2: Verify the project still typechecks**

Run: `npx tsc --noEmit`
Expected: no errors (every entry in `content/players.json` already includes `stats.rank`).

- [ ] **Step 3: Commit**

```bash
git add src/types/Player.ts
git commit -m "refactor: make PlayerStats.rank required"
```

---

## Task 4: Remove unused `no_socials` translation key

**Files:**
- Modify: `messages/es.json:36`
- Modify: `messages/en.json:36`

**Interfaces:** None — this key has zero consumers (verified via grep on `src`).

- [ ] **Step 1: Confirm there are no consumers**

Run: `grep -rn "no_socials" --include="*.ts" --include="*.tsx" src`
Expected: no output.

- [ ] **Step 2: Remove the key from `messages/es.json`**

Remove this line (currently line 36):

```json
      "no_socials": "Sin redes",
```

- [ ] **Step 3: Remove the key from `messages/en.json`**

Remove this line (currently line 36):

```json
      "no_socials": "No socials",
```

- [ ] **Step 4: Verify the project still typechecks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add messages/es.json messages/en.json
git commit -m "chore: remove unused playerCard.no_socials translation key"
```

---

## Task 5: Extract and test `getAge` and `getActiveSocialLinks` helpers

**Files:**
- Create: `src/components/ui/player-card/player-card.utils.ts`
- Create: `src/components/ui/player-card/player-card.utils.test.ts`

This task only adds the new utils module and its tests. `PlayerCard.tsx` keeps its current inline `getAge`/`socialLinks` logic untouched (temporary duplication) until Task 7 rewrites the whole file to use these helpers — that keeps every commit in this task green without a half-migrated component in between.

**Interfaces:**
- Produces:
  - `getAge(birthYear: number | null): number | null`
  - `type SocialPlatform = "twitter" | "instagram" | "twitch" | "tiktok" | "youtube" | "rltracker"`
  - `getActiveSocialLinks(socials: PlayerSocials): { platform: SocialPlatform; href: string; label: string }[]`
- Consumes: `PlayerSocials` from `@/types/Player`.
- Task 7 imports both functions and the `SocialPlatform` type from this file.

- [ ] **Step 1: Write the failing tests**

Create `src/components/ui/player-card/player-card.utils.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getAge, getActiveSocialLinks } from "./player-card.utils";
import type { PlayerSocials } from "@/types/Player";

describe("getAge", () => {
  it("returns null when birthYear is null", () => {
    expect(getAge(null)).toBeNull();
  });

  it("returns the difference between the current year and birthYear", () => {
    const currentYear = new Date().getFullYear();
    expect(getAge(currentYear - 25)).toBe(25);
  });
});

describe("getActiveSocialLinks", () => {
  const baseSocials: PlayerSocials = {
    twitter: null,
    instagram: null,
    twitch: null,
    tiktok: null,
    youtube: null,
    rltracker: null,
  };

  it("returns an empty array when no socials are set", () => {
    expect(getActiveSocialLinks(baseSocials)).toEqual([]);
  });

  it("returns only the socials that have a value, in a fixed order", () => {
    const socials: PlayerSocials = {
      ...baseSocials,
      youtube: "https://youtube.com/@blazeon",
      twitter: "https://x.com/blazeon_rl",
      rltracker: "https://rocketleague.tracker.network/profile/blazeon",
    };

    expect(getActiveSocialLinks(socials)).toEqual([
      { platform: "twitter", href: "https://x.com/blazeon_rl", label: "Twitter / X" },
      { platform: "youtube", href: "https://youtube.com/@blazeon", label: "YouTube" },
      { platform: "rltracker", href: "https://rocketleague.tracker.network/profile/blazeon", label: "RLTracker" },
    ]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- player-card.utils`
Expected: FAIL with "Cannot find module './player-card.utils'" (the file doesn't exist yet).

- [ ] **Step 3: Implement the helpers**

Create `src/components/ui/player-card/player-card.utils.ts`:

```ts
import type { PlayerSocials } from "@/types/Player";

export function getAge(birthYear: number | null): number | null {
  if (!birthYear) return null;
  return new Date().getFullYear() - birthYear;
}

export type SocialPlatform =
  | "twitter"
  | "instagram"
  | "twitch"
  | "tiktok"
  | "youtube"
  | "rltracker";

const SOCIAL_ORDER: SocialPlatform[] = [
  "twitter",
  "instagram",
  "twitch",
  "tiktok",
  "youtube",
  "rltracker",
];

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  twitter: "Twitter / X",
  instagram: "Instagram",
  twitch: "Twitch",
  tiktok: "TikTok",
  youtube: "YouTube",
  rltracker: "RLTracker",
};

export interface ActiveSocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

export function getActiveSocialLinks(socials: PlayerSocials): ActiveSocialLink[] {
  return SOCIAL_ORDER.flatMap((platform) => {
    const href = socials[platform];
    if (!href) return [];
    return [{ platform, href, label: SOCIAL_LABELS[platform] }];
  });
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- player-card.utils`
Expected: PASS, 4 tests.

- [ ] **Step 5: Verify the project still typechecks**

Run: `npx tsc --noEmit`
Expected: no errors (`PlayerCard.tsx` is untouched in this task, so this just confirms the new module doesn't break anything else).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/player-card/player-card.utils.ts src/components/ui/player-card/player-card.utils.test.ts
git commit -m "feat: extract PlayerCard age and social-link helpers"
```

---

## Task 6: Add the `IconRLTracker` icon component

**Files:**
- Create: `src/components/ui/icons/IconRLTracker.tsx`
- Modify: `src/components/ui/icons/index.ts`

**Interfaces:**
- Produces: `IconRLTracker({ size?: number; className?: string }): JSX.Element`, same shape as the other icons in this folder (e.g. `IconX`). Task 7 imports `IconRLTracker` from `@/components/ui/icons`.

- [ ] **Step 1: Create the icon, following the existing `IconX` pattern**

Create `src/components/ui/icons/IconRLTracker.tsx`:

```tsx
interface IconRLTrackerProps {
  size?: number;
  className?: string;
}

export const IconRLTracker = ({ size = 20, className }: IconRLTrackerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      viewBox="0 0 16 16"
    >
      <path d="M1 13.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1H14V3a.5.5 0 0 0-.5-.5h-2A.5.5 0 0 0 11 3v10H9V6a.5.5 0 0 0-.5-.5h-2A.5.5 0 0 0 6 6v7H4V9a.5.5 0 0 0-.5-.5h-2A.5.5 0 0 0 1 9z" />
    </svg>
  );
};
```

- [ ] **Step 2: Export it from the icons barrel**

In `src/components/ui/icons/index.ts`, add (keep alphabetical order with the existing exports):

```ts
export * from './IconRLTracker';
```

- [ ] **Step 3: Verify the project still typechecks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/icons/IconRLTracker.tsx src/components/ui/icons/index.ts
git commit -m "feat: add IconRLTracker icon"
```

---

## Task 7: Update `PlayerCard` — rank badge, RLTracker link, locale-aware numbers

**Files:**
- Modify: `src/components/ui/player-card/PlayerCard.tsx` (full rewrite of the body, same file)
- Create: `src/components/ui/player-card/PlayerCard.test.tsx`

**Interfaces:**
- Consumes: `getAge`, `getActiveSocialLinks`, `SocialPlatform` from `./player-card.utils` (Task 5); `IconRLTracker` from `@/components/ui/icons` (Task 6); `Player`, `PlayerType`, `PlayerStatus` from `@/types/Player` (Task 3).
- Produces: `PlayerCard({ player: Player }): JSX.Element`, same public signature as before — no consumer of `PlayerCard` (i.e. `TeamHighlight.tsx`) needs to change.

- [ ] **Step 1: Write the failing tests**

Create `src/components/ui/player-card/PlayerCard.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerCard } from "./PlayerCard";
import type { Player } from "@/types/Player";

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "es",
}));

const basePlayer: Player = {
  id: "blazeon",
  nickname: "Blazeon",
  realName: "Raúl",
  birthYear: 2000,
  anonymous: false,
  country: "ES",
  type: "player",
  status: "active",
  game: "rocket-league",
  joinedYear: 2023,
  stats: { mmr: 1847, peak: 1900, rank: "Grand Champion IF" },
  socials: {
    twitter: "https://x.com/blazeon_rl",
    instagram: null,
    twitch: null,
    tiktok: null,
    youtube: null,
    rltracker: "https://rocketleague.tracker.network/profile/blazeon",
  },
  image: null,
};

describe("PlayerCard", () => {
  it("renders the player's rank badge", () => {
    render(<PlayerCard player={basePlayer} />);
    expect(screen.getByText("Grand Champion IF")).toBeInTheDocument();
  });

  it("renders an RLTracker link when socials.rltracker is set", () => {
    render(<PlayerCard player={basePlayer} />);
    const link = screen.getByLabelText("RLTracker");
    expect(link).toHaveAttribute("href", basePlayer.socials.rltracker);
  });

  it("does not render an RLTracker link when socials.rltracker is null", () => {
    render(<PlayerCard player={{ ...basePlayer, socials: { ...basePlayer.socials, rltracker: null } }} />);
    expect(screen.queryByLabelText("RLTracker")).not.toBeInTheDocument();
  });

  it("formats MMR using the active locale", () => {
    render(<PlayerCard player={{ ...basePlayer, stats: { ...basePlayer.stats, mmr: 12345 } }} />);
    expect(screen.getByText("12.345")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- PlayerCard.test`
Expected: FAIL — the rank badge and RLTracker link don't exist yet, and `12345` is currently rendered as `"12,345"` (en-US formatting) instead of `"12.345"` (es formatting).

- [ ] **Step 3: Rewrite `PlayerCard.tsx`**

Replace the full contents of `src/components/ui/player-card/PlayerCard.tsx` with:

```tsx
"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Player, PlayerType, PlayerStatus } from "@/types/Player";
import {
  IconX,
  IconInstagram,
  IconTwitch,
  IconTikTok,
  IconYouTube,
  IconRLTracker,
} from "@/components/ui/icons";
import { getAge, getActiveSocialLinks, SocialPlatform } from "./player-card.utils";
import "./player-card.scss";

interface PlayerCardProps {
  player: Player;
}

const ROLE_KEY: Record<PlayerType, string> = {
  player: "role_player",
  coach: "role_coach",
  analyst: "role_analyst",
  manager: "role_manager",
};

const STATUS_KEY: Record<PlayerStatus, string | null> = {
  active: null,
  substitute: "status_substitute",
  retired: "status_retired",
  former: "status_former",
};

const SOCIAL_ICONS: Record<SocialPlatform, typeof IconX> = {
  twitter: IconX,
  instagram: IconInstagram,
  twitch: IconTwitch,
  tiktok: IconTikTok,
  youtube: IconYouTube,
  rltracker: IconRLTracker,
};

export function PlayerCard({ player }: PlayerCardProps) {
  const t = useTranslations("home.playerCard");
  const locale = useLocale();
  const age = getAge(player.birthYear);
  const { stats } = player;

  const roleLabel = t(ROLE_KEY[player.type]);
  const statusKey = STATUS_KEY[player.status];
  const socialLinks = getActiveSocialLinks(player.socials);

  return (
    <article className="player-card">
      {/* ── Background image / placeholder ── */}
      <div className="player-card__bg">
        {player.image ? (
          <Image
            src={player.image}
            alt={player.nickname}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="player-card__img"
            priority={false}
          />
        ) : (
          <div className="player-card__no-image" aria-hidden="true">
            <span className="player-card__no-image-icon">?</span>
          </div>
        )}
        <div className="player-card__overlay" />
      </div>

      {/* ── Top badges ── */}
      <div className="player-card__top">
        <span className="player-card__role">{roleLabel}</span>
        <span className="player-card__rank">
          <span className="player-card__rank-dot" aria-hidden="true" />
          {stats.rank}
        </span>
        {statusKey && (
          <span className="player-card__status">{t(statusKey)}</span>
        )}
      </div>

      {/* ── Main info ── */}
      <div className="player-card__body">
        <div className="player-card__identity">
          <h3 className="player-card__nickname">{player.nickname}</h3>
          {!player.anonymous && (
            <p className="player-card__realname">{player.realName}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="player-card__stats">
          <div className="player-card__stat">
            <span className="player-card__stat-value">
              {stats.mmr.toLocaleString(locale)}
            </span>
            <span className="player-card__stat-label">{t("stat_mmr")}</span>
          </div>
          <div className="player-card__stat-divider" />
          <div className="player-card__stat">
            <span className="player-card__stat-value">
              {stats.peak.toLocaleString(locale)}
            </span>
            <span className="player-card__stat-label">{t("stat_peak")}</span>
          </div>
          {!!age && (
            <>
              <div className="player-card__stat-divider" />
              <div className="player-card__stat">
                <span className="player-card__stat-value">{age}</span>
                <span className="player-card__stat-label">{t("stat_age")}</span>
              </div>
            </>
          )}
        </div>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="player-card__socials">
            {socialLinks.map((s) => {
              const Icon = SOCIAL_ICONS[s.platform];
              return (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="player-card__social-link"
                  aria-label={s.label}
                  title={s.label}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Decorative corner accent ── */}
      <div className="player-card__corner" aria-hidden="true" />
    </article>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- PlayerCard.test`
Expected: PASS, 4 tests.

- [ ] **Step 5: Run the full test suite and typecheck**

Run: `npm test && npx tsc --noEmit`
Expected: all tests pass, no type errors.

- [ ] **Step 6: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/player-card/PlayerCard.tsx src/components/ui/player-card/PlayerCard.test.tsx
git commit -m "feat: show rank badge and RLTracker link in PlayerCard"
```

---

## Task 8: Style the rank badge in `player-card.scss`

**Files:**
- Modify: `src/components/ui/player-card/player-card.scss`

**Interfaces:** None — pure CSS, consumed by the `player-card__rank` / `player-card__rank-dot` classes added in Task 7.

- [ ] **Step 1: Replace the unused `.player-card__rank` / `.player-card__rank-dot` rules**

The current file already has a `.player-card__rank` block (originally written for a feature that was never wired up) plus `.player-card__rank-dot`, written for a standalone pill layout. Replace both with a version that matches the `.player-card__status` pill styling (since rank now lives in the same badge row as role/status), keeping the dot:

Find this block in `src/components/ui/player-card/player-card.scss`:

```scss
  /* Rank badge */
  .player-card__rank {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-ui), sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-secondary);
    border: 1px solid var(--border-subtle);
    border-radius: 2px;
    padding: 5px 10px;
    background: rgba(10, 10, 10, 0.5);
    width: fit-content;
    backdrop-filter: blur(6px);
  }

  .player-card__rank-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--brand);
    flex-shrink: 0;
    box-shadow: 0 0 6px var(--brand);
  }
```

Replace it with:

```scss
  /* Rank badge */
  .player-card__rank {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-ui), sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: var(--bg-overlay);
    border: 1px solid var(--border-subtle);
    padding: 4px 10px;
    border-radius: 2px;
    line-height: 1.5;
    backdrop-filter: blur(8px);
  }

  .player-card__rank-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--brand);
    flex-shrink: 0;
    box-shadow: 0 0 5px var(--brand);
  }
```

- [ ] **Step 2: Allow the top badge row to wrap on narrow cards**

Find:

```scss
  .player-card__top {
    position: absolute;
    top: 14px;
    left: 14px;
    right: 14px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 6px;
  }
```

Replace with:

```scss
  .player-card__top {
    position: absolute;
    top: 14px;
    left: 14px;
    right: 14px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
```

- [ ] **Step 3: Visually verify in the browser**

Use the `/run` skill to start the dev server and open the home page (`TeamHighlight` section), confirming:
- Each card shows role + rank (+ status, for the substitute player) in the top row, wrapping cleanly instead of overflowing.
- The RLTracker icon appears in the social row for every player (all have `rltracker` set in `content/players.json`).
- Hover state, corner accent, and existing spacing still look correct.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/player-card/player-card.scss
git commit -m "style: align rank badge with the top badge row in PlayerCard"
```
