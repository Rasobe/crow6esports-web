# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
/
@~/claude-config/skills/frontend.md
@~/claude-config/skills/nextjs.md
@~/claude-config/skills/typescript.md
@~/claude-config/skills/commits.md

@AGENTS.md

> **Importante:** `AGENTS.md` advierte que esta versión de Next.js (16.2.7) tiene cambios respecto a lo que conoces de entrenamiento. Antes de usar una API de Next.js, consulta `node_modules/next/dist/docs/` en lugar de asumir el comportamiento clásico.

## Comandos

```bash
npm run dev      # servidor de desarrollo (Next.js + Turbopack/webpack según config)
npm run build    # build de producción
npm run start    # sirve el build de producción
npm run lint      # ESLint (eslint-config-next core-web-vitals + typescript)
```

No hay test runner configurado en `package.json` (sin `test` script, sin Jest/Vitest instalado).

El proyecto usa `pnpm-lock.yaml` y `package-lock.json` simultáneamente; confirma con el usuario qué gestor de paquetes usar antes de instalar nada (instrucción global: no instalar dependencias nuevas sin pedirlo).

## Arquitectura

### Internacionalización (next-intl)

Todas las rutas de contenido viven bajo `src/app/[locale]/...`. El locale se resuelve en `proxy.ts` (middleware de next-intl, matcher excluye `api`, `_next`, `_vercel` y archivos estáticos) y en `src/i18n/routing.ts` (`locales: ["es", "en"]`, default `"es"`). Los textos están en `messages/es.json` y `messages/en.json`, cargados por locale en `src/i18n/request.ts`. `src/app/[locale]/layout.tsx` envuelve cada página en `NextIntlClientProvider` y monta `Navbar`/`Footer` globales.

### Alias de imports (tsconfig paths)

- `@/*` → `src/*`
- `@config/*` → `config/*` (config de negocio fuera de `src/`: `site.ts`, `routes.ts`, `navigation.ts`, `stats.ts`)
- `@content/*` → `content/*` (datos estáticos versionados: `players.json`, `stock.json`, MDX de noticias)

### Organización por features (Clean Architecture)

```
src/
├── app/                  # solo routing/layouts del App Router — sin lógica de negocio
├── features/<dominio>/   # home, team, news, store — lógica y componentes específicos de un dominio
│   ├── components/
│   └── lib/
├── components/
│   ├── ui/               # componentes de presentación genéricos y reutilizables (Button, PlayerCard, SectionHeader…)
│   ├── layout/            # Navbar, Footer y piezas de layout global
│   └── seo/
├── lib/                  # clientes de servicios externos (stripe.ts, email.ts, keystatic.ts)
└── types/
```

Convención de carpetas de componentes (aplica tanto en `components/` como en `features/*/components/`):

- Carpeta del componente en `kebab-case`, archivo del componente en `PascalCase.tsx`.
- Estilos colocados junto al componente: `kebab-case.scss` (Sass; ver `next.config.ts` → `loadPaths` apunta a `src`).
- Cada carpeta exporta vía un `index.ts` barrel (`export * from "./Componente"`); los imports externos siempre pasan por el barrel, nunca por la ruta del archivo concreto.
- Subcomponentes privados de un componente (usados solo por él) van en una subcarpeta `_components/` junto a su propio `index.ts`. El prefijo `_` sigue la convención de carpetas privadas de Next.js, reutilizada aquí también para agrupar piezas internas no enrutables.
- `barrel-builder.config.json` controla el generador de barrels (extensión de editor); no auto-sincroniza on create/delete/rename, así que los `index.ts` deben actualizarse a mano al añadir o quitar componentes.

### Contenido como fuente de verdad

No hay base de datos. `content/players.json` y `content/stock.json` son los datos estáticos del roster y la tienda; las noticias son archivos `.mdx` en `content/news/`. Cualquier cambio de "datos" (jugadores, stock, artículos) se hace editando estos ficheros, no a través de una API o panel admin (Keystatic está previsto como capa de edición sobre estos mismos ficheros, ver `src/lib/keystatic.ts`).

### Estilos

Tailwind CSS v4 (vía `@tailwindcss/postcss`) combinado con Sass por componente. Los tokens y utilidades globales viven en `src/styles/` (`_tokens.scss`, `_typography.scss`, `_tailwind-theme.scss`, `_reset.scss`, `_utilities.scss`, `_scrollbar.scss`) e importan desde `src/app/globals.scss`. Identidad visual: alto contraste, anguloso, sin border-radius generoso; botones con `clip-path` diagonal. Paleta y tipografías están documentadas en `README.md`.

### Integraciones externas

- **Stripe** (`src/lib/stripe.ts`) — checkout de tienda vía Route Handlers en `app/api/`.
- **Resend** (`src/lib/email.ts`) — notificaciones de tryouts/pedidos.
- **Keystatic** (`src/lib/keystatic.ts`) — panel de edición de contenido sobre los archivos en `content/`, sin backend propio.

No hay servidor backend separado: los Route Handlers de Next.js cubren pagos y email.
