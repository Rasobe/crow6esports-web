# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
/
@~/claude-config/skills/frontend.md
@~/claude-config/skills/typescript.md
@~/claude-config/skills/commits.md

@AGENTS.md

> **Importante:** `AGENTS.md` advierte que este proyecto usa Astro 7, posterior a tu entrenamiento. Antes de usar una API de Astro, consulta https://docs.astro.build en lugar de asumir el comportamiento clásico.

## Comandos

```bash
pnpm dev --ignore-lock  # servidor de desarrollo en primer plano (sin la bandera, Astro lo lanza en segundo plano)
pnpm build              # build de producción (adaptador Vercel)
pnpm lint               # ESLint (typescript-eslint + eslint-plugin-astro)
pnpm typecheck          # astro check
pnpm test               # Vitest (solo lógica pura, entorno node)
pnpm e2e                # Playwright (arranca el dev server solo)
```

Gestor de paquetes: **pnpm** (único lockfile). Husky ejecuta gitleaks + lint-staged + typecheck en pre-commit, commitlint en commit-msg y lint + typecheck + test + build en pre-push.

## Arquitectura

### Capas (Clean Architecture)

```
ui ─────────────┐
                ├──> application ──> domain
infrastructure ─┘
```

- `src/domain/<contexto>/` — modelos, reglas puras y puertos (`*.repository.ts`). Sin imports de Astro ni librerías.
- `src/application/<contexto>/` — casos de uso; reciben el repositorio como argumento. Solo importan domain.
- `src/infrastructure/` — adaptadores (JSON de `content/`, content collections) y `container.ts` como composition root.
- `src/ui/` — componentes `.astro`, layouts e i18n. Obtienen datos con casos de uso + `container`.
- `src/pages/` — solo routing, sin lógica de negocio.

El rol va en el sufijo del fichero (`.repository`, `.json-repository`, `.content-repository`). Agrupar por contexto de negocio, no por tipo técnico.

### Internacionalización

Rutas bajo `src/pages/[locale]/…` con locales `es` (default) y `en`. `src/middleware.ts` resuelve el locale (prefijo de la URL o `accept-language`), lo expone en `Astro.locals.locale`, aplica el modo mantenimiento (`MAINTENANCE_MODE` → rewrite a `/coming-soon`) y reescribe a `/404` los locales inválidos. Los textos están en `src/ui/i18n/locales/{es,en}.json`; se usan con `createTranslator(locale, namespace)`. Enlaces con `localizePath(locale, path)`. Variables de entorno tipadas con `astro:env` (ver `astro.config.ts` y `.env.example`).

### Alias de imports (tsconfig paths)

- `@/*` → `src/*`
- `@config/*` → `config/*` (config de negocio: `site.ts`, `routes.ts`, `navigation.ts`, `stats.ts`)
- `@content/*` → `content/*` (datos estáticos: `players.json`, `stock.json`, MDX de noticias)

### Componentes

- Carpeta en `kebab-case`, archivo en `PascalCase.astro`, estilos colocados como `kebab-case.scss` e importados en el frontmatter.
- Compartidos en `ui/shared/components/` (se exportan desde su `index.ts`); lo que usa una sola feature en `ui/features/<x>/components/`.
- Subcomponentes privados en `_components/`.
- JS de cliente solo cuando hace falta: custom element con `<script>` para cosas simples (ver `MobileMenu.astro`) o isla React (`client:load`) para formularios complejos (ver `ui/features/tryouts`). Las islas no pueden importar componentes `.astro` ni el barrel `ui/shared/components`: importa los `.tsx` directamente. Reciben sus textos como prop (`getMessages(locale, namespace)` + `createMessageTranslator`).
- `Button`, `CTAButton` y `PlayerCard` leen el locale de `Astro.locals`: no hace falta pasarlo por props.

### Contenido como fuente de verdad

No hay base de datos. `content/players.json` y `content/stock.json` son los datos del roster y la tienda; las noticias son `.mdx` en `content/news/` (content collection `news`). Cualquier cambio de datos se hace editando estos ficheros.

### Estilos

SCSS por componente + tokens CSS globales en `src/styles/` (`_tokens`, `_reset`, `_typography`, `_scrollbar`, `_utilities`), importados desde `src/styles/global.scss`. Orden de capas: `@layer base, components` (`_layers.scss`); los estilos de componente van dentro de `@layer components`. No hay Tailwind.

**Tokens y mixins (única fuente de verdad):** `src/styles/_tokens.scss` define colores (incluidos los canales `--brand-rgb`, `--white-rgb`, `--bg-base-rgb`, `--danger-rgb` para componer alfas con `rgb(var(--brand-rgb) / 0.2)`), estados, familias (`--ff-*`), tamaños (`--fs-*`), tracking (`--tracking-*`), espaciado (`--space-*`), líneas (`--line*`), capas (`--z-*`), movimiento (`--duration-*`, `--ease-*`) y layout (`--gutter`, `--section-py`). `src/styles/_mixins.scss` aporta `below()/above()` para breakpoints (en rem), `container` y `angular-cut()`. Importar con `@use "styles/mixins" as *;`. Los componentes no declaran colores, tamaños, tiempos ni capas globales a mano: si falta un valor, se añade el token primero. Valores puntuales (marcas de agua decorativas, ópticos) pueden quedar locales.

Identidad visual: alto contraste, anguloso, sin border-radius generoso; botones con `clip-path` diagonal. Fuentes vía la Fonts API de Astro (`--font-display`, `--font-ui`, `--font-body`).

### Integraciones externas

Los endpoints viven en `src/pages/api/` y solo orquestan: validan con zod (esquemas en `infrastructure/`), llaman a un caso de uso y devuelven JSON. Tryouts: `POST /api/contact` → `submitTryoutApplication` → puerto `TryoutNotifier` → adaptador Resend (`infrastructure/tryouts`). Los emails escapan siempre el contenido del usuario. Stripe está instalado pero sin implementar. No hay servidor backend separado.
