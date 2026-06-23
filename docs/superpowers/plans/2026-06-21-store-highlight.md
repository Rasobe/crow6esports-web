# StoreHighlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `StoreHighlight` section to the home page showing up to 3 products with a real `ProductCard` (currently a stub), plus a "Ver más" CTA to `/store`.

**Architecture:** Three tasks: (1) i18n copy for both new namespaces, (2) implement `ProductCard` as a simple preview card reused from `@/features/store`, (3) the new `StoreHighlight` component that consumes `ProductCard` and is wired into the home page. This ordering lets each task be reviewed independently — Task 3 depends on Task 2's `ProductCard` contract, Task 2 depends on Task 1's translation keys.

**Tech Stack:** Next.js (App Router) + TypeScript, next-intl (`useTranslations`, `useFormatter`), Sass (`@layer components`), `next/image`.

## Global Constraints

- No new dependencies, no `console.log`, no `any`.
- All UI text comes from `messages/es.json` + `messages/en.json` — no hardcoded strings, including currency symbols (use `useFormatter().number(price, { style: "currency", currency })`).
- No test runner is configured in this repo — verification uses `npm run lint`, `npm run build`, and manual inspection via `npm run dev`/`curl`.
- Commit format: Conventional Commits, imperative, ≤72 chars, English.
- `ProductCard` is a **preview** card only: no `SizeSelector`, no `CheckoutButton`, no Stripe — the whole card links to `ROUTES.store`.
- `lib/inventory.ts` and `content/stock.json` are NOT modified.
- Follow existing component folder convention: kebab-case folder, PascalCase component file, colocated `kebab-case.scss`, barrel `index.ts`.

---

### Task 1: Add storeHighlight + productCard i18n copy

**Files:**
- Modify: `messages/es.json:42-72` (insert after `coachingBanner` block, and after `playerCard` block)
- Modify: `messages/en.json:42-68` (same insertion points)

**Interfaces:**
- Produces: translation keys consumed by Task 2 (`home.productCard.*`) and Task 3 (`home.storeHighlight.*`).
  - `home.storeHighlight`: `eyebrow`, `title`, `subtitle`, `cta_view_more`
  - `home.productCard`: `category_jersey`, `category_hoodie`, `category_cap`, `category_accessory`, `featured_badge`

- [ ] **Step 1: Add `storeHighlight` block to `messages/es.json`**

In `messages/es.json`, immediately after the `coachingBanner` block's closing `},` (the line right before `"playerCard": {`), insert:

```json
    "storeHighlight": {
      "eyebrow": "La Tienda",
      "title": "Viste los colores de Crow6",
      "subtitle": "Equipación oficial pensada para el equipo y la afición.",
      "cta_view_more": "Ver más"
    },
```

- [ ] **Step 2: Add `productCard` block to `messages/es.json`**

Immediately after the `playerCard` block's closing `}` (before the `},` that closes `"home"` and the `"team": {` line), change:

```json
    "playerCard": {
      "stat_mmr": "MMR",
      "stat_peak": "PEAK",
      "stat_age": "EDAD",
      "role_player": "Jugador",
      "role_coach": "Entrenador",
      "role_analyst": "Analista",
      "role_manager": "Manager",
      "status_substitute": "Suplente",
      "status_retired": "Retirado",
      "status_former": "Ex-miembro"
    }
  },
```

to:

```json
    "playerCard": {
      "stat_mmr": "MMR",
      "stat_peak": "PEAK",
      "stat_age": "EDAD",
      "role_player": "Jugador",
      "role_coach": "Entrenador",
      "role_analyst": "Analista",
      "role_manager": "Manager",
      "status_substitute": "Suplente",
      "status_retired": "Retirado",
      "status_former": "Ex-miembro"
    },
    "productCard": {
      "category_jersey": "Camiseta",
      "category_hoodie": "Sudadera",
      "category_cap": "Gorra",
      "category_accessory": "Accesorio",
      "featured_badge": "Destacado"
    }
  },
```

- [ ] **Step 3: Add `storeHighlight` block to `messages/en.json`**

In `messages/en.json`, immediately after the `coachingBanner` block's closing `},` (the line right before `"playerCard": {`), insert:

```json
    "storeHighlight": {
      "eyebrow": "The Store",
      "title": "Wear the Crow6 colors",
      "subtitle": "Official gear designed for the team and the fans.",
      "cta_view_more": "View more"
    },
```

- [ ] **Step 4: Add `productCard` block to `messages/en.json`**

Change:

```json
    "playerCard": {
      "stat_mmr": "MMR",
      "stat_peak": "PEAK",
      "stat_age": "AGE",
      "role_player": "Player",
      "role_coach": "Coach",
      "role_analyst": "Analyst",
      "role_manager": "Manager",
      "status_substitute": "Substitute",
      "status_retired": "Retired",
      "status_former": "Former"
    }
  },
```

to:

```json
    "playerCard": {
      "stat_mmr": "MMR",
      "stat_peak": "PEAK",
      "stat_age": "AGE",
      "role_player": "Player",
      "role_coach": "Coach",
      "role_analyst": "Analyst",
      "role_manager": "Manager",
      "status_substitute": "Substitute",
      "status_retired": "Retired",
      "status_former": "Former"
    },
    "productCard": {
      "category_jersey": "Jersey",
      "category_hoodie": "Hoodie",
      "category_cap": "Cap",
      "category_accessory": "Accessory",
      "featured_badge": "Featured"
    }
  },
```

- [ ] **Step 5: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/es.json','utf8')); JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('ok')"`
Expected: `ok`

- [ ] **Step 6: Commit**

```bash
git add messages/es.json messages/en.json
git commit -m "feat(i18n): add storeHighlight and productCard copy"
```

---

### Task 2: Implement ProductCard as a preview card

**Files:**
- Modify: `src/features/store/components/ProductCard.tsx` (replace stub)
- Create: `src/features/store/components/product-card.scss`

**Interfaces:**
- Consumes: `Product` type from `../types` (`{ id, slug, name, description, price, currency: "EUR" | "USD", images: string[], stock: StockItem[], category: "jersey" | "hoodie" | "cap" | "accessory", featured: boolean }`), translation keys from Task 1 (`home.productCard.category_jersey`, `category_hoodie`, `category_cap`, `category_accessory`, `featured_badge`), `Link` from `@/i18n/navigation`, `ROUTES.store` from `@config/routes`.
- Produces: `ProductCard({ product }: { product: Product })` — JSX consumed by Task 3's `StoreHighlight`. Renders class names `product-card`, `product-card__media`, `product-card__img`, `product-card__no-image`, `product-card__top`, `product-card__category`, `product-card__featured`, `product-card__body`, `product-card__name`, `product-card__price`.

- [ ] **Step 1: Replace `ProductCard.tsx`**

Replace the full contents of `src/features/store/components/ProductCard.tsx`:

```tsx
// features/store/components/ProductCard.tsx
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@config/routes";
import type { Product, ProductCategory } from "../types";
import "./product-card.scss";

interface ProductCardProps {
  product: Product;
}

const CATEGORY_KEY: Record<ProductCategory, string> = {
  jersey: "category_jersey",
  hoodie: "category_hoodie",
  cap: "category_cap",
  accessory: "category_accessory",
};

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("home.productCard");
  const format = useFormatter();
  const image = product.images[0];

  return (
    <article className="product-card">
      <Link href={ROUTES.store} className="product-card__link">
        <div className="product-card__media">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="product-card__img"
            />
          ) : (
            <div className="product-card__no-image" aria-hidden="true">
              <span className="product-card__no-image-icon">?</span>
            </div>
          )}
          <div className="product-card__top">
            <span className="product-card__category">
              {t(CATEGORY_KEY[product.category])}
            </span>
            {product.featured && (
              <span className="product-card__featured">
                {t("featured_badge")}
              </span>
            )}
          </div>
        </div>

        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__price">
            {format.number(product.price, {
              style: "currency",
              currency: product.currency,
            })}
          </p>
        </div>
      </Link>
    </article>
  );
}
```

- [ ] **Step 2: Add `ProductCategory` type export**

In `src/features/store/types.ts`, the `Product` type already defines `category: "jersey" | "hoodie" | "cap" | "accessory"` inline. Add a named type above `Product` so `ProductCard.tsx` can reference it:

```ts
export type ProductCategory = "jersey" | "hoodie" | "cap" | "accessory";
```

Then change the `Product` type's `category` field to use it:

```ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: "EUR" | "USD";
  images: string[];
  stock: StockItem[];
  category: ProductCategory;
  featured: boolean;
};
```

The full file `src/features/store/types.ts` should read:

```ts
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type StockItem = {
  size: Size;
  quantity: number;
};

export type ProductCategory = "jersey" | "hoodie" | "cap" | "accessory";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: "EUR" | "USD";
  images: string[];
  stock: StockItem[];
  category: ProductCategory;
  featured: boolean;
};
```

- [ ] **Step 3: Export `ProductCategory` from the store barrel**

In `src/features/store/index.ts`, change:

```ts
export type { Product, Size, StockItem } from "./types";
```

to:

```ts
export type { Product, Size, StockItem, ProductCategory } from "./types";
```

- [ ] **Step 4: Create `product-card.scss`**

Create `src/features/store/components/product-card.scss`:

```scss
@layer components {
  .product-card {
    position: relative;
    width: 100%;
    max-width: 320px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      border-color 0.25s ease;

    &:hover {
      transform: translateY(-6px);
      border-color: var(--border-strong);

      .product-card__img {
        transform: scale(1.06);
      }
    }
  }

  .product-card__link {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
  }

  .product-card__media {
    position: relative;
    aspect-ratio: 4 / 5;
    overflow: hidden;
  }

  .product-card__img {
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .product-card__no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      160deg,
      var(--bg-raised) 0%,
      var(--bg-surface) 100%
    );
  }

  .product-card__no-image-icon {
    font-family: var(--font-display), sans-serif;
    font-size: 6rem;
    color: var(--border-strong);
    line-height: 1;
    user-select: none;
  }

  .product-card__top {
    position: absolute;
    top: 14px;
    left: 14px;
    right: 14px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .product-card__category {
    font-family: var(--font-ui), sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: var(--bg-overlay);
    border: 1px solid var(--border-subtle);
    padding: 4px 10px;
    backdrop-filter: blur(8px);
  }

  .product-card__featured {
    font-family: var(--font-ui), sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--brand-fg);
    background: var(--brand);
    padding: 4px 10px;
  }

  .product-card__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
  }

  .product-card__name {
    font-family: var(--font-display), sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--text-primary);
    text-transform: uppercase;
  }

  .product-card__price {
    font-family: var(--font-ui), sans-serif;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--brand);
  }
}
```

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: no errors for `ProductCard.tsx`, `types.ts`, or `index.ts` (pre-existing unrelated errors in other files are out of scope).

- [ ] **Step 6: Commit**

```bash
git add src/features/store/components/ProductCard.tsx src/features/store/components/product-card.scss src/features/store/types.ts src/features/store/index.ts
git commit -m "feat(store): implement ProductCard as a preview card"
```

---

### Task 3: Add StoreHighlight section to the home page

**Files:**
- Create: `src/features/home/components/store-highlight/StoreHighlight.tsx`
- Create: `src/features/home/components/store-highlight/store-highlight.scss`
- Create: `src/features/home/components/store-highlight/index.ts`
- Modify: `src/features/home/components/index.ts`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `getProducts` and `ProductCard` from `@/features/store` (Task 2's component), `SectionHeader`/`Button` from `@/components/ui`, `ROUTES.store` from `@config/routes`, translation keys from Task 1 (`home.storeHighlight.*`).
- Produces: `StoreHighlight()` component, exported from `@/features/home`, rendered in `src/app/[locale]/page.tsx` after `<CoachingBanner />`.

- [ ] **Step 1: Create `StoreHighlight.tsx`**

Create `src/features/home/components/store-highlight/StoreHighlight.tsx`:

```tsx
"use client";

import { getProducts, ProductCard } from "@/features/store";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui";
import { ROUTES } from "@config/routes";
import { useTranslations } from "next-intl";
import "./store-highlight.scss";

const products = getProducts();

export function StoreHighlight() {
  const t = useTranslations("home.storeHighlight");

  return (
    <section className="store-highlight">
      <div className="store-highlight__inner">
        <SectionHeader namespace="home.storeHighlight" />

        <div className="store-highlight__grid">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="store-highlight__footer">
          <Button href={ROUTES.store} variant="outline">
            {t("cta_view_more")}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `store-highlight.scss`**

Create `src/features/home/components/store-highlight/store-highlight.scss`:

```scss
@layer components {
  .store-highlight {
    position: relative;
    padding: 100px 0;
    overflow: hidden;
    background: var(--bg-surface);
  }

  .store-highlight__inner {
    max-width: var(--container);
    margin-inline: auto;
    padding-inline: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 56px;
  }

  /* ─── Cards grid (centered, doesn't stretch with few items) ─── */
  .store-highlight__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 320px));
    justify-content: center;
    gap: 20px;
  }

  .store-highlight__footer {
    display: flex;
    justify-content: flex-end;
  }

  /* ─── Responsive ─── */
  @media (max-width: 640px) {
    .store-highlight {
      padding: 64px 0;
    }

    .store-highlight__inner {
      gap: 36px;
    }

    .store-highlight__grid {
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

- [ ] **Step 3: Create the component's barrel**

Create `src/features/home/components/store-highlight/index.ts`:

```ts
export * from './StoreHighlight';
```

- [ ] **Step 4: Add `StoreHighlight` to the home components barrel**

In `src/features/home/components/index.ts`, change:

```ts
export * from './coaching-banner';
export * from './hero-section';
export * from './team-highlight';
```

to:

```ts
export * from './coaching-banner';
export * from './hero-section';
export * from './store-highlight';
export * from './team-highlight';
```

- [ ] **Step 5: Wire `StoreHighlight` into the home page**

In `src/app/[locale]/page.tsx`, change:

```tsx
import { CoachingBanner, HeroSection, TeamHighlight } from "@/features/home";
import { createGenerateMetadata } from "@/components/seo/MetaTags";

export const generateMetadata = createGenerateMetadata("home", "");

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TeamHighlight />
      <CoachingBanner />
    </>
  );
}
```

to:

```tsx
import {
  CoachingBanner,
  HeroSection,
  StoreHighlight,
  TeamHighlight,
} from "@/features/home";
import { createGenerateMetadata } from "@/components/seo/MetaTags";

export const generateMetadata = createGenerateMetadata("home", "");

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TeamHighlight />
      <CoachingBanner />
      <StoreHighlight />
    </>
  );
}
```

- [ ] **Step 6: Run lint and build**

Run: `npm run lint && npm run build`
Expected: no new errors/warnings (pre-existing unrelated errors in `MobileMenu.tsx` and `i18n/request.ts` are out of scope).

- [ ] **Step 7: Manual visual check**

Run: `npm run dev`, open the home page, scroll past `CoachingBanner`.
Expected: a "La Tienda" section with `--bg-surface` background, showing 1 product card (Jersey CROW6 2025) centered (not stretched), with category badge "Camiseta", "Destacado" badge (product is `featured: true`), name, price formatted as "59,99 €", and a "Ver más" outline button right-aligned below, linking to `/store`.

- [ ] **Step 8: Commit**

```bash
git add src/features/home/components/store-highlight src/features/home/components/index.ts src/app/\[locale\]/page.tsx
git commit -m "feat(home): add store-highlight section to home page"
```
