# crow6esports-web

Sitio web oficial de [Crow 6 Esports](https://crow6esports.com) — organización competitiva de Rocket League fundada en 2020.

## Stack

| Capa      | Tecnología                           | Motivo                                                  |
| --------- | ------------------------------------ | ------------------------------------------------------- |
| Framework | Astro 7 (SSR en Vercel)              | HTML por defecto sin JS, SEO, endpoints como backend    |
| Estilos   | SCSS por componente + tokens CSS     | Estilos colocados junto al componente, sin runtime      |
| CMS       | Keystatic                            | Panel visual sobre el propio repo, sin servidor externo |
| Pagos     | Stripe                               | Gestión de pedidos de tienda                            |
| Email     | Resend                               | Notificaciones de tryouts y pedidos                     |
| Hosting   | Vercel                               | Adaptador oficial de Astro, free tier suficiente        |
| Fuentes   | Anton SC · Barlow Condensed · Barlow | Google Fonts vía la Fonts API de Astro                 |

## Estructura del proyecto

```
crow6esports-web/
├── src/
│   ├── domain/<contexto>/          # Modelos y puertos (team, store, news). TS puro
│   ├── application/<contexto>/     # Casos de uso, uno por fichero. Solo importa domain
│   ├── infrastructure/             # Adaptadores (JSON, content collections) y container.ts
│   ├── ui/
│   │   ├── features/<x>/components # Componentes .astro de una sola feature
│   │   ├── shared/components/      # Button, PlayerCard, Icon, Seo…
│   │   ├── layouts/                # BaseLayout, LocaleLayout, navbar, footer
│   │   └── i18n/                   # Traductor, locales/{es,en}.json
│   ├── pages/                      # Solo routing: [locale]/…, 404, coming-soon, robots, sitemap
│   ├── styles/                     # Tokens y estilos globales (SCSS)
│   ├── middleware.ts               # Locale, modo mantenimiento y 404 de locales inválidos
│   └── content.config.ts           # Content collection de noticias (MDX)
├── content/                        # Fuente de verdad — players.json, stock.json, news/*.mdx
├── config/                         # site, routes, navigation, stats
├── e2e/                            # Tests Playwright
└── public/
```

Las dependencias van `ui → application → domain` e `infrastructure → domain`. `ui` nunca instancia repositorios: los consume a través de `infrastructure/container.ts`.

## Decisiones técnicas relevantes

**Sin CMS externo de pago.** Keystatic funciona sobre el repo de GitHub. Los archivos de contenido son markdown/JSON versionados con el código. Sin coste operativo, sin dependencia de terceros para el contenido.

**Sin base de datos.** El stock de tienda vive en `content/stock.json`. Con 10 unidades iniciales no hay justificación para una base de datos. Si el volumen crece, la migración es reemplazar las lecturas de JSON por llamadas a una API — el resto no cambia.

**Sin Shopify.** El volumen actual no justifica 29$/mes. Stripe + gestión manual de pedidos cubre las necesidades con coste cero hasta escala real.

**Sin scraping de RLTracker.** La API pública de RLTracker no es oficial y puede romperse sin aviso. Los datos de jugadores se actualizan manualmente en `content/players.json`.

**Astro como backend.** Los endpoints en `src/pages/api/` (SSR en Vercel) cubrirán pagos y email sin necesidad de un servidor separado. Si en el futuro se necesita un backend independiente, esos handlers se mueven a Express/Fastify y las llamadas en cliente pasan de `/api/checkout` a `https://api.crow6esports.com/checkout`.

## Identidad visual

| Token          | Valor            |
| -------------- | ---------------- |
| Negro primario | `#141414`        |
| Superficie     | `#1A1A1A`        |
| Oro            | `#F2A900`        |
| Blanco         | `#FFFFFF`        |
| Fuente display | Anton SC         |
| Fuente UI      | Barlow Condensed |
| Fuente cuerpo  | Barlow           |

Estilo: alto contraste, anguloso, sin border-radius generoso. Los botones usan `clip-path` diagonal para mantener coherencia con el lenguaje visual del jersey.

## Desarrollo local

```bash
pnpm install
pnpm dev          # servidor de desarrollo (usa --ignore-lock para ejecutarlo en primer plano)
pnpm build        # build de producción
pnpm lint         # ESLint
pnpm typecheck    # astro check
pnpm test         # Vitest
pnpm e2e          # Playwright
```

Requiere Node.js 22+ y pnpm.

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
STRIPE_SECRET_KEY=sk_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
RESEND_API_KEY=re_...
MAINTENANCE_MODE=true
SITE_URL=https://crow6esports.com
```

Nunca subas `.env.local` al repositorio. Está incluido en `.gitignore`.

**`MAINTENANCE_MODE`:** Si se define como `true`, todas las rutas se reescriben a `/coming-soon` excepto la propia página de mantenimiento. Útil para desactivar el sitio temporalmente sin desplegar. Para restaurar el comportamiento normal, desactívalo o asígnale cualquier otro valor. Configurable tanto en `.env.local` como en el panel de Vercel.

## Despliegue

El proyecto despliega automáticamente en Vercel en cada push a `main`. Las variables de entorno se configuran en el panel de Vercel, no en el repo.

## Módulos pendientes

- [ ] Setup base: layout, Navbar, Footer
- [ ] Feature `team/`: tipos, PlayerCard, RosterGrid
- [ ] Feature `news/`: parser MDX, ArticleCard
- [ ] Feature `store/`: inventario JSON, CheckoutButton, integración Stripe
- [ ] Feature `tryouts/`: formulario, integración Resend
- [ ] Keystatic CMS: configuración y panel de administración
- [ ] SEO: metadata, Open Graph, sitemap
- [ ] Despliegue inicial en Vercel

---

**Crow 6 Esports** · Huesca, España · Est. 2020 · [crow6esports.com](https://crow6esports.com) · [@crow6esports](https://linktr.ee/crow6esports)
