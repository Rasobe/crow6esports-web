# Coming Soon / Maintenance Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `MAINTENANCE_MODE` env-var-gated rewrite so every route except `/coming-soon` serves an isolated "coming soon" screen with the Crow 6 Esports logo and visual identity, without deleting or restructuring any existing page.

**Architecture:** `proxy.ts` checks `process.env.MAINTENANCE_MODE` before delegating to the existing `next-intl` middleware; when active it rewrites every non-`/coming-soon` request to a new root-level `/coming-soon` page that lives outside the `[locale]` segment (so it never inherits `Navbar`/`Footer`). The page renders a new `ComingSoonPage` feature component with fixed Spanish copy and project design tokens.

**Tech Stack:** Next.js 16 App Router, `next/server` (`NextRequest`/`NextResponse`), Vitest + React Testing Library (existing setup in `vitest.config.ts`).

## Global Constraints

- Do not modify, create, or read any `.env*` file. `MAINTENANCE_MODE` is documented for the user to set manually (spec: "Fuera de alcance").
- Do not delete or restructure any existing page/route.
- Coming-soon page copy is fixed Spanish text, no `next-intl` (spec: explicit decision, page lives outside `[locale]`).
- Follow existing component folder convention: kebab-case folder, PascalCase component file, colocated `kebab-case.scss`, barrel `index.ts` (see `src/features/team`).
- No `border-radius`; sharp/angular accents using `--brand` per existing identity (see `page-header.scss`).
- No new dependencies.

---

### Task 1: `ComingSoonPage` component

**Files:**
- Create: `src/features/coming-soon/components/ComingSoonPage.tsx`
- Create: `src/features/coming-soon/components/coming-soon.scss`
- Create: `src/features/coming-soon/components/ComingSoonPage.test.tsx`
- Create: `src/features/coming-soon/components/index.ts`
- Create: `src/features/coming-soon/index.ts`

**Interfaces:**
- Produces: `ComingSoonPage` — a no-props React component, exported from `src/features/coming-soon` (via barrel), default-rendered by Task 2's route page.

- [ ] **Step 1: Write the failing test**

Create `src/features/coming-soon/components/ComingSoonPage.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComingSoonPage } from "./ComingSoonPage";

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

describe("ComingSoonPage", () => {
  it("renders the Crow 6 Esports logo", () => {
    render(<ComingSoonPage />);
    const logo = screen.getByAltText("Crow 6 Esports");
    expect(logo).toHaveAttribute("src", "/images/brand/crow6-wordmark.svg");
  });

  it("renders the eyebrow, title and description", () => {
    render(<ComingSoonPage />);
    expect(screen.getByText("Estamos preparando algo")).toBeInTheDocument();
    expect(screen.getByText("Próximamente")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Estamos trabajando en una nueva experiencia para Crow 6 Esports. Vuelve pronto.",
      ),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- ComingSoonPage.test.tsx`
Expected: FAIL — `Cannot find module './ComingSoonPage'` (file doesn't exist yet).

- [ ] **Step 3: Write the component and styles**

Create `src/features/coming-soon/components/coming-soon.scss`:

```scss
@layer components {
    .coming-soon {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-base);
        padding: 24px;
    }

    .coming-soon__inner {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        max-width: 480px;
        text-align: center;
        padding-top: 32px;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 64px;
            height: 3px;
            background: linear-gradient(to right, transparent, var(--brand), transparent);
        }
    }

    .coming-soon__eyebrow {
        font-family: var(--font-ui), sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 4px;
        text-transform: uppercase;
        color: var(--brand);
    }

    .coming-soon__title {
        font-family: var(--font-display), sans-serif;
        font-size: clamp(40px, 9vw, 72px);
        line-height: 0.95;
        letter-spacing: 0.02em;
        color: var(--text-primary);
        text-transform: uppercase;
    }

    .coming-soon__description {
        font-family: var(--font-body), sans-serif;
        font-size: 15px;
        color: var(--text-secondary);
        line-height: 1.7;
    }
}
```

Create `src/features/coming-soon/components/ComingSoonPage.tsx`:

```tsx
import Image from "next/image";
import "./coming-soon.scss";

export function ComingSoonPage() {
  return (
    <div className="coming-soon">
      <div className="coming-soon__inner">
        <Image
          src="/images/brand/crow6-wordmark.svg"
          alt="Crow 6 Esports"
          width={200}
          height={70}
          priority
        />
        <span className="coming-soon__eyebrow">Estamos preparando algo</span>
        <h1 className="coming-soon__title">Próximamente</h1>
        <p className="coming-soon__description">
          Estamos trabajando en una nueva experiencia para Crow 6 Esports. Vuelve pronto.
        </p>
      </div>
    </div>
  );
}
```

Create `src/features/coming-soon/components/index.ts`:

```ts
export * from './ComingSoonPage'
```

Create `src/features/coming-soon/index.ts`:

```ts
export * from './components';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- ComingSoonPage.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/features/coming-soon
git commit -m "feat(coming-soon): add ComingSoonPage component"
```

---

### Task 2: `/coming-soon` route page

**Files:**
- Create: `src/app/coming-soon/page.tsx`

**Interfaces:**
- Consumes: `ComingSoonPage` from `@/features/coming-soon` (Task 1).
- Produces: the `/coming-soon` route, which Task 3's middleware rewrites to.

- [ ] **Step 1: Create the route page**

Create `src/app/coming-soon/page.tsx`:

```tsx
import type { Metadata } from "next";
import { ComingSoonPage } from "@/features/coming-soon";

export const metadata: Metadata = {
  title: "Crow 6 Esports — Próximamente",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ComingSoonPage />;
}
```

- [ ] **Step 2: Verify it builds and renders**

Run: `npm run build`
Expected: build succeeds, output lists `/coming-soon` as a generated route, no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/coming-soon/page.tsx
git commit -m "feat(coming-soon): add /coming-soon route page"
```

---

### Task 3: Maintenance-mode rewrite in `proxy.ts`

**Files:**
- Modify: `proxy.ts`
- Create: `proxy.test.ts` (project root, alongside `proxy.ts`)

**Interfaces:**
- Consumes: `routing` from `./src/i18n/routing` (unchanged), `/coming-soon` route from Task 2.
- Produces: default-exported `middleware(request: NextRequest): NextResponse`, used by Next.js as the proxy/middleware entry point. Existing `config.matcher` export is unchanged.

- [ ] **Step 1: Write the failing tests**

Create `proxy.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const intlMiddlewareMock = vi.fn(() => NextResponse.next());

vi.mock("next-intl/middleware", () => ({
  default: () => intlMiddlewareMock,
}));

import middleware from "./proxy";

describe("middleware", () => {
  const originalEnv = process.env.MAINTENANCE_MODE;

  afterEach(() => {
    process.env.MAINTENANCE_MODE = originalEnv;
    intlMiddlewareMock.mockClear();
  });

  it("delegates to the next-intl middleware when maintenance mode is off", () => {
    process.env.MAINTENANCE_MODE = "false";
    const request = new NextRequest(new URL("https://example.com/es/team"));

    middleware(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });

  it("delegates to the next-intl middleware when MAINTENANCE_MODE is unset", () => {
    delete process.env.MAINTENANCE_MODE;
    const request = new NextRequest(new URL("https://example.com/"));

    middleware(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });

  it("rewrites to /coming-soon when maintenance mode is on", () => {
    process.env.MAINTENANCE_MODE = "true";
    const request = new NextRequest(new URL("https://example.com/es/team"));

    const response = middleware(request);

    expect(response.headers.get("x-middleware-rewrite")).toBe("https://example.com/coming-soon");
    expect(intlMiddlewareMock).not.toHaveBeenCalled();
  });

  it("does not rewrite the /coming-soon path itself, even in maintenance mode", () => {
    process.env.MAINTENANCE_MODE = "true";
    const request = new NextRequest(new URL("https://example.com/coming-soon"));

    middleware(request);

    expect(intlMiddlewareMock).toHaveBeenCalledWith(request);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- proxy.test.ts`
Expected: FAIL — `proxy.ts` has no default-exported `middleware` function yet (current `proxy.ts` only has `export default createMiddleware(routing)`, so `intlMiddlewareMock` is never called and rewrite assertions fail).

- [ ] **Step 3: Implement the rewrite logic**

Replace the full contents of `proxy.ts` with:

```ts
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const isComingSoonPath = request.nextUrl.pathname === "/coming-soon";

  if (isMaintenanceMode && !isComingSoonPath) {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [String.raw`/((?!api|_next|_vercel|.*\..*).*)`],
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- proxy.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add proxy.ts proxy.test.ts
git commit -m "feat(maintenance): rewrite to /coming-soon when MAINTENANCE_MODE is on"
```

---

### Task 4: Full-suite verification and manual check

**Files:** none (verification only)

**Interfaces:** none — this task only verifies Tasks 1–3 together.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests pass, including the new `ComingSoonPage.test.tsx` and `proxy.test.ts`.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Run a production build**

Run: `npm run build`
Expected: build succeeds; route list includes `/coming-soon`, `/[locale]`, `/[locale]/team`, etc. unchanged.

- [ ] **Step 4: Manual check — maintenance mode off (default)**

Run: `npm run start` (after build), then in another terminal:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/es/team
```

Expected: `200`, and visiting `http://localhost:3000/es/team` in the browser shows the normal Team page with Navbar/Footer.

- [ ] **Step 5: Manual check — maintenance mode on**

Stop the server, then run:

```bash
MAINTENANCE_MODE=true npm run build && MAINTENANCE_MODE=true npm run start
```

In another terminal:

```bash
curl -s http://localhost:3000/es/team | grep -o "Próximamente"
curl -s http://localhost:3000/ | grep -o "Próximamente"
curl -s http://localhost:3000/coming-soon | grep -o "Próximamente"
```

Expected: all three commands print `Próximamente`. Visiting `http://localhost:3000/es/team` in the browser shows the coming-soon screen (logo, eyebrow, title, description) with no Navbar/Footer, and the URL bar still shows `/es/team`.

- [ ] **Step 6: Report env var requirement to the user**

No code step — confirm with the user that `MAINTENANCE_MODE=true` must be set manually in their local `.env` and/or in the Vercel project's environment variables to activate maintenance mode in that environment, since this plan does not touch any `.env` file.
