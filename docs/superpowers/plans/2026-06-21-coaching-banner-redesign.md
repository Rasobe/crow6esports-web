# CoachingBanner Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `CoachingBanner` as a 3-pack pricing-anchor block (básico/destacado/premium) with a credibility line, replacing the current placeholder packs that have no price, features, or dedicated styles.

**Architecture:** `CoachingBanner.tsx` maps a local `packs` data array to JSX instead of repeating 3 hardcoded blocks; new i18n keys drive all copy; `coaching-banner.scss` adds a CSS grid (desktop) / horizontal-scroll-snap (mobile, same pattern as `team-highlight`) layout with a visually elevated `.coaching-pack--featured`.

**Tech Stack:** Next.js (App Router) + TypeScript, next-intl, Sass (`@layer components`), design tokens from `src/styles/_tokens.scss`.

## Global Constraints

- No new dependencies, no `console.log`, no `any` (spec: project-wide rule, not specific to this feature).
- All UI text comes from `messages/es.json` + `messages/en.json` — no hardcoded strings (per project memory: i18n rule applies even to "simple" components).
- No test runner is configured in this repo (no Jest/Vitest, no `test` script) — verification steps use `npm run lint`, `npm run build`, and manual inspection via `npm run dev` instead of automated tests.
- Follow existing component folder convention: kebab-case folder, PascalCase component file, colocated `kebab-case.scss`, barrel `index.ts` (already in place for `coaching-banner/`).
- Commit format: Conventional Commits, imperative, ≤72 chars, English.

---

### Task 1: Add coaching-banner copy to i18n messages

**Files:**
- Modify: `messages/es.json:40-45` (`home.coachingBanner` block)
- Modify: `messages/en.json:40-44` (`home.coachingBanner` block)

**Interfaces:**
- Produces: translation keys consumed by Task 2 via `useTranslations("home.coachingBanner")` — `credibility`, `pack_1_title`, `pack_1_price`, `pack_1_description`, `pack_1_feature_1`, `pack_1_feature_2`, `pack_1_feature_3`, `pack_2_badge`, `pack_2_title`, `pack_2_price`, `pack_2_description`, `pack_2_feature_1..4`, `pack_3_title`, `pack_3_price`, `pack_3_description`, `pack_3_feature_1..4`, `cta_reserve` (already exists in es, missing in en).

- [ ] **Step 1: Update `messages/es.json` `home.coachingBanner` block**

Replace lines 40-45:

```json
    "coachingBanner": {
      "eyebrow": "Entrenamiento profesional",
      "title": "Lleva tu juego al siguiente nivel",
      "subtitle": "Entrenamiento personalizado para mejorar tu rendimiento en Rocket League en equipo o individualmente.",
      "credibility": "3 años formando jugadores hasta 1900+ MMR",
      "pack_1_title": "Pack Básico",
      "pack_1_price": "28€/mes",
      "pack_1_description": "Ideal para empezar a pulir tu mecánica y tus decisiones en partido.",
      "pack_1_feature_1": "1 sesión semanal (60 min)",
      "pack_1_feature_2": "Feedback de tu última partida ranked",
      "pack_1_feature_3": "Acceso al Discord de la academia",
      "pack_2_badge": "Más elegido",
      "pack_2_title": "Pack Destacado",
      "pack_2_price": "55€/mes",
      "pack_2_description": "El equilibrio perfecto entre seguimiento constante y precio.",
      "pack_2_feature_1": "2 sesiones semanales (60 min)",
      "pack_2_feature_2": "Análisis de replays personalizado",
      "pack_2_feature_3": "Plan de mejora mensual",
      "pack_2_feature_4": "Acceso prioritario a horarios",
      "pack_3_title": "Pack Premium",
      "pack_3_price": "78€/mes",
      "pack_3_description": "Entrenamiento intensivo para quien compite al máximo nivel.",
      "pack_3_feature_1": "3 sesiones semanales (60 min)",
      "pack_3_feature_2": "Análisis de VOD ilimitado",
      "pack_3_feature_3": "Seguimiento 1 a 1 por Discord",
      "pack_3_feature_4": "Sesión mensual con el equipo de analistas",
      "cta_reserve": "Reservar sesión"
    },
```

- [ ] **Step 2: Update `messages/en.json` `home.coachingBanner` block**

Replace lines 40-44:

```json
    "coachingBanner": {
      "eyebrow": "Professional training",
      "title": "Take your game to the next level",
      "subtitle": "Personalized training to improve your performance in Rocket League in team or individually.",
      "credibility": "3 years training players up to 1900+ MMR",
      "pack_1_title": "Basic Pack",
      "pack_1_price": "€28/month",
      "pack_1_description": "Ideal for starting to sharpen your mechanics and in-game decisions.",
      "pack_1_feature_1": "1 weekly session (60 min)",
      "pack_1_feature_2": "Feedback on your latest ranked match",
      "pack_1_feature_3": "Access to the academy Discord",
      "pack_2_badge": "Most popular",
      "pack_2_title": "Featured Pack",
      "pack_2_price": "€55/month",
      "pack_2_description": "The perfect balance between consistent coaching and price.",
      "pack_2_feature_1": "2 weekly sessions (60 min)",
      "pack_2_feature_2": "Personalized replay analysis",
      "pack_2_feature_3": "Monthly improvement plan",
      "pack_2_feature_4": "Priority scheduling access",
      "pack_3_title": "Premium Pack",
      "pack_3_price": "€78/month",
      "pack_3_description": "Intensive training for those competing at the highest level.",
      "pack_3_feature_1": "3 weekly sessions (60 min)",
      "pack_3_feature_2": "Unlimited VOD analysis",
      "pack_3_feature_3": "1-on-1 follow-up on Discord",
      "pack_3_feature_4": "Monthly session with the analyst team",
      "cta_reserve": "Book a session"
    },
```

- [ ] **Step 3: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/es.json','utf8')); JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('ok')"`
Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add messages/es.json messages/en.json
git commit -m "feat(i18n): add coaching-banner pack copy and credibility line"
```

---

### Task 2: Rebuild CoachingBanner component with data-driven packs

**Files:**
- Modify: `src/features/home/components/coaching-banner/CoachingBanner.tsx`

**Interfaces:**
- Consumes: translation keys from Task 1 (`home.coachingBanner.*`), `Button`/`SectionHeader` from `@/components/ui`, `ROUTES.coaching` from `@config/routes`.
- Produces: rendered DOM structure consumed by Task 3's CSS — class names `coaching-banner`, `coaching-banner__inner`, `coaching-banner__credibility`, `coaching-banner__packs`, `coaching-pack`, `coaching-pack--featured`, `coaching-pack__badge`, `coaching-pack__title`, `coaching-pack__price`, `coaching-pack__description`, `coaching-pack__features`.

- [ ] **Step 1: Replace component body**

Replace the full contents of `CoachingBanner.tsx`:

```tsx
import { Button, SectionHeader } from "@/components/ui";
import "./coaching-banner.scss";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";

interface CoachingPack {
  id: "pack_1" | "pack_2" | "pack_3";
  featured: boolean;
  featureCount: number;
}

const PACKS: CoachingPack[] = [
  { id: "pack_1", featured: false, featureCount: 3 },
  { id: "pack_2", featured: true, featureCount: 4 },
  { id: "pack_3", featured: false, featureCount: 4 },
];

export function CoachingBanner() {
  const t = useTranslations("home.coachingBanner");

  return (
    <section className="coaching-banner">
      <div className="coaching-banner__inner">
        <SectionHeader namespace="home.coachingBanner" />

        <p className="coaching-banner__credibility">{t("credibility")}</p>

        <div className="coaching-banner__packs">
          {PACKS.map(({ id, featured, featureCount }) => (
            <div
              key={id}
              className={
                featured ? "coaching-pack--featured" : "coaching-pack"
              }
            >
              {featured && (
                <span className="coaching-pack__badge">
                  {t("pack_2_badge")}
                </span>
              )}
              <h3 className="coaching-pack__title">{t(`${id}_title`)}</h3>
              <p className="coaching-pack__price">{t(`${id}_price`)}</p>
              <p className="coaching-pack__description">
                {t(`${id}_description`)}
              </p>
              <ul className="coaching-pack__features">
                {Array.from({ length: featureCount }, (_, index) => (
                  <li key={index}>
                    {t(`${id}_feature_${index + 1}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="coaching-banner__footer">
          <Button href={ROUTES.coaching} variant="primary">
            {t("cta_reserve")}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors for `coaching-banner/CoachingBanner.tsx` (the unused `next/link` import is removed, no `any` used).

- [ ] **Step 3: Commit**

```bash
git add src/features/home/components/coaching-banner/CoachingBanner.tsx
git commit -m "feat(home): rebuild coaching-banner packs as data-driven pricing list"
```

---

### Task 3: Style the pricing-anchor layout

**Files:**
- Modify: `src/features/home/components/coaching-banner/coaching-banner.scss`

**Interfaces:**
- Consumes: class names produced by Task 2; tokens `--brand`, `--brand-fg`, `--bg-surface`, `--bg-raised`, `--border`, `--border-strong`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--text-muted`, `--grad-surface` from `src/styles/_tokens.scss`.
- Produces: final visual styling — no further tasks depend on this.

- [ ] **Step 1: Replace `coaching-banner.scss` contents**

```scss
@layer components {
  .coaching-banner {
    position: relative;
    padding: 100px 0;
    overflow: hidden;
  }

  .coaching-banner__inner {
    max-width: var(--container);
    margin-inline: auto;
    padding-inline: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 56px;
  }

  .coaching-banner__credibility {
    align-self: center;
    margin-top: -24px;
    padding: 0.5rem 1.25rem;
    border: 1px solid var(--border-strong);
    color: var(--text-secondary);
    font-size: 0.8125rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .coaching-banner__packs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    gap: 24px;
  }

  .coaching-pack,
  .coaching-pack--featured {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 2rem;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
  }

  .coaching-pack--featured {
    background: var(--grad-surface);
    border-color: var(--brand);
    padding: 2.5rem 2rem;
    transform: scale(1.05);
    z-index: 1;
  }

  .coaching-pack__badge {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25rem 1rem;
    background: var(--brand);
    color: var(--brand-fg);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .coaching-pack__title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .coaching-pack__price {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--brand);
  }

  .coaching-pack__description {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-style: italic;
  }

  .coaching-pack__features {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    list-style: none;
    color: var(--text-secondary);
    font-size: 0.875rem;

    li {
      padding-left: 1.25rem;
      position: relative;

      &::before {
        content: "—";
        position: absolute;
        left: 0;
        color: var(--brand);
      }
    }
  }

  .coaching-banner__footer {
    display: flex;
    justify-content: center;
  }

  /* ─── Responsive ─── */
  @media (max-width: 640px) {
    .coaching-banner {
      padding: 64px 0;
    }

    .coaching-banner__inner {
      gap: 36px;
    }

    .coaching-banner__credibility {
      margin-top: 0;
    }

    .coaching-banner__packs {
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
        flex: 0 0 80%;
        max-width: 300px;
        scroll-snap-align: start;
      }
    }

    .coaching-pack--featured {
      order: -1;
      transform: none;
    }
  }
}
```

- [ ] **Step 2: Run lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed with no errors.

- [ ] **Step 3: Manual visual check**

Run: `npm run dev`, open the home page in a browser, scroll to the coaching banner.
Expected: credibility line above the 3 packs; featured pack (Pack Destacado) visually elevated with "Más elegido" badge between Básico (28€) and Premium (78€); on a narrow viewport (≤640px), packs scroll horizontally with the featured pack shown first; CTA "Reservar sesión" links to `/coaching`.

- [ ] **Step 4: Commit**

```bash
git add src/features/home/components/coaching-banner/coaching-banner.scss
git commit -m "style(home): add pricing-anchor layout to coaching-banner"
```
