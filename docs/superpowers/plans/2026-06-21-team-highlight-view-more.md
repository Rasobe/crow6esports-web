# TeamHighlight View-More Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Limit the home `TeamHighlight` grid to 3 player cards and add a right-aligned "Ver más" button below it linking to `ROUTES.team`.

**Architecture:** Single-component change — slice the existing `players` array to 3 items in `TeamHighlight.tsx`, add a footer `Button` reusing the project's existing `@/components/ui` `Button`, and add matching SCSS for the new footer row.

**Tech Stack:** Next.js (App Router) + TypeScript, next-intl, Sass (`@layer components`).

## Global Constraints

- No new dependencies, no `console.log`, no `any`.
- All UI text comes from `messages/es.json` + `messages/en.json` — no hardcoded strings.
- No test runner is configured in this repo — verification uses `npm run lint` and `npm run build`, plus manual inspection via `npm run dev`.
- `lib/players.ts` (`getPlayers`/`getActivePlayers`) is NOT modified — the 3-card limit is applied only in the component.
- Commit format: Conventional Commits, imperative, ≤72 chars, English.

---

### Task 1: Limit grid to 3 players, add "Ver más" button and copy

**Files:**
- Modify: `messages/es.json:35-39` (`home.teamHighlight` block)
- Modify: `messages/en.json:35-39` (`home.teamHighlight` block)
- Modify: `src/features/home/components/team-highlight/TeamHighlight.tsx`
- Modify: `src/features/home/components/team-highlight/team-highlight.scss`

**Interfaces:**
- Consumes: `Button` and `SectionHeader` from `@/components/ui`, `ROUTES.team` from `@config/routes`, `getPlayers()` from `@/features/home/lib/players` (unchanged signature: returns `Player[]`).
- Produces: new class `team-highlight__footer` used only within this component; no other task/file depends on it.

- [ ] **Step 1: Add `cta_view_more` key to `messages/es.json`**

Replace lines 35-39:

```json
    "teamHighlight": {
      "eyebrow": "El Equipo",
      "title": "Conoce a nuestros jugadores",
      "subtitle": "Profesionales dedicados que representan a Crow6 en la arena competitiva.",
      "cta_view_more": "Ver más"
    },
```

- [ ] **Step 2: Add `cta_view_more` key to `messages/en.json`**

Replace lines 35-39:

```json
    "teamHighlight": {
      "eyebrow": "The Team",
      "title": "Meet our players",
      "subtitle": "Dedicated professionals representing Crow6 in the competitive arena.",
      "cta_view_more": "View more"
    },
```

- [ ] **Step 3: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/es.json','utf8')); JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('ok')"`
Expected: `ok`

- [ ] **Step 4: Update `TeamHighlight.tsx`**

Replace the full contents of `src/features/home/components/team-highlight/TeamHighlight.tsx`:

```tsx
"use client";

import { getPlayers } from "@/features/home/lib/players";
import { PlayerCard } from "@/components/ui/player-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";
import "./team-highlight.scss";

const players = getPlayers();

export function TeamHighlight() {
  const t = useTranslations("home.teamHighlight");

  return (
    <section className="team-highlight">
      <div className="team-highlight__inner">
        <SectionHeader namespace="home.teamHighlight" />

        <div className="team-highlight__grid">
          {players.slice(0, 3).map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>

        <div className="team-highlight__footer">
          <Button href={ROUTES.team} variant="outline">
            {t("cta_view_more")}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add `.team-highlight__footer` style**

In `src/features/home/components/team-highlight/team-highlight.scss`, add this block immediately after the closing brace of `.team-highlight__grid` (which currently ends right before the `/* ─── Responsive ─── */` comment, around line 42):

```scss
  .team-highlight__footer {
    display: flex;
    justify-content: flex-end;
  }
```

The full file should read (only the new block is added, everything else stays the same):

```scss
@layer components {
  .team-highlight {
    position: relative;
    padding: 100px 0;
    overflow: hidden;

    /* Subtle top glow line */
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 1px;
      background: linear-gradient(
        to right,
        transparent,
        var(--border-strong),
        transparent
      );
    }
  }

  .team-highlight__inner {
    max-width: var(--container);
    margin-inline: auto;
    padding-inline: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 56px;
  }

  /* ─── Cards grid (left → right) ─── */
  .team-highlight__grid {
    display: grid;
    /* Shared column tracks keep every row's cards the same width,
       even when the last row has fewer items. */
    grid-template-columns: repeat(auto-fit, minmax(260px, 320px));
    justify-content: center;
    gap: 20px;
  }

  .team-highlight__footer {
    display: flex;
    justify-content: flex-end;
  }

  /* ─── Responsive ─── */
  @media (max-width: 640px) {
    .team-highlight {
      padding: 64px 0;
    }

    .team-highlight__inner {
      gap: 36px;
    }

    .team-highlight__grid {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      > * {
        flex: 0 0 75%;
        max-width: 280px;
        scroll-snap-align: start;
      }
    }
  }
}
```

- [ ] **Step 6: Run lint and build**

Run: `npm run lint && npm run build`
Expected: no new errors/warnings for `TeamHighlight.tsx` or `team-highlight.scss` (pre-existing unrelated lint errors in other files, e.g. `MobileMenu.tsx` and `i18n/request.ts`, are not part of this task's scope).

- [ ] **Step 7: Manual visual check**

Run: `npm run dev`, open the home page, scroll to the team section.
Expected: exactly 3 player cards shown (Blazeon, Vortex, Nxvak with current `content/players.json` order); a "Ver más" outline button appears right-aligned below the grid; clicking it navigates to `/team` (currently an empty page — expected, out of scope).

- [ ] **Step 8: Commit**

```bash
git add messages/es.json messages/en.json src/features/home/components/team-highlight/TeamHighlight.tsx src/features/home/components/team-highlight/team-highlight.scss
git commit -m "feat(home): cap team-highlight to 3 players with view-more CTA"
```
