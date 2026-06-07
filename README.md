# crow6esports-web

Sitio web oficial de [Crow 6 Esports](https://crow6esports.com) — organización competitiva de Rocket League fundada en 2020.

## Stack

| Capa | Tecnología | Motivo |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/SSG nativo, SEO, Route Handlers como backend |
| Estilos | Tailwind CSS | Utilidad, consistencia, sin overhead de runtime |
| CMS | Keystatic | Panel visual sobre el propio repo, sin servidor externo |
| Pagos | Stripe | Gestión de pedidos de tienda |
| Email | Resend | Notificaciones de tryouts y pedidos |
| Hosting | Vercel | Integración nativa con Next.js, free tier suficiente |
| Fuentes | Anton SC · Barlow Condensed · Barlow | Google Fonts, optimizadas con next/font |

## Estructura del proyecto

```
crow6esports-web/
├── app/                    # Next.js App Router — solo routing y layouts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── team/page.tsx
│   ├── news/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── store/
│   │   ├── page.tsx
│   │   └── [product]/page.tsx
│   ├── tryouts/page.tsx
│   └── api/
│       ├── checkout/route.ts
│       └── contact/route.ts
├── features/               # Lógica por dominio
│   ├── home/
│   ├── team/
│   ├── news/
│   └── store/
├── components/             # Componentes globales reutilizables
│   ├── ui/
│   ├── layout/
│   └── seo/
├── lib/                    # Clientes de servicios externos
│   ├── stripe.ts
│   ├── email.ts
│   └── keystatic.ts
├── content/                # Fuente de verdad — datos estáticos
│   ├── news/               # Archivos .mdx
│   ├── players.json
│   └── stock.json
├── public/
├── styles/
│   └── globals.css
└── config/
    ├── site.ts             # Nombre, URL, handles de redes sociales
    └── design-tokens.ts    # Colores y tipografía como constantes TS
```

## Decisiones técnicas relevantes

**Sin CMS externo de pago.** Keystatic funciona sobre el repo de GitHub. Los archivos de contenido son markdown/JSON versionados con el código. Sin coste operativo, sin dependencia de terceros para el contenido.

**Sin base de datos.** El stock de tienda vive en `content/stock.json`. Con 10 unidades iniciales no hay justificación para una base de datos. Si el volumen crece, la migración es reemplazar las lecturas de JSON por llamadas a una API — el resto no cambia.

**Sin Shopify.** El volumen actual no justifica 29$/mes. Stripe + gestión manual de pedidos cubre las necesidades con coste cero hasta escala real.

**Sin scraping de RLTracker.** La API pública de RLTracker no es oficial y puede romperse sin aviso. Los datos de jugadores se actualizan manualmente en `content/players.json`.

**Next.js como backend.** Los Route Handlers en `app/api/` cubren pagos y email sin necesidad de un servidor separado. Si en el futuro se necesita un backend independiente, esos handlers se mueven a Express/Fastify y las llamadas en cliente pasan de `/api/checkout` a `https://api.crow6esports.com/checkout`.

## Identidad visual

| Token | Valor |
|---|---|
| Negro primario | `#141414` |
| Superficie | `#1A1A1A` |
| Oro | `#F2A900` |
| Blanco | `#FFFFFF` |
| Fuente display | Anton SC |
| Fuente UI | Barlow Condensed |
| Fuente cuerpo | Barlow |

Estilo: alto contraste, anguloso, sin border-radius generoso. Los botones usan `clip-path` diagonal para mantener coherencia con el lenguaje visual del jersey.

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

Requiere Node.js 18+.

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
RESEND_API_KEY=re_...
```

Nunca subas `.env.local` al repositorio. Está incluido en `.gitignore` por defecto con `create-next-app`.

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
