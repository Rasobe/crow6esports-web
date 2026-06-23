# StoreHighlight — Sección de tienda en el home

## Contexto

El home (`src/app/[locale]/page.tsx`) tiene `HeroSection`, `TeamHighlight` y `CoachingBanner`. Falta una sección que dé visibilidad a la tienda. `content/stock.json` tiene hoy 1 producto (Jersey CROW6 2025); a futuro habrá sudaderas, gorras, etc. (`Product.category` ya incluye `"hoodie" | "cap" | "accessory"`).

`ProductCard`, `SizeSelector` y `CheckoutButton` (`src/features/store/components/`) son stubs vacíos (`return <div />`). Esta tarea implementa `ProductCard` como card de vistazo simple — sin selector de talla ni checkout embebido, eso queda para cuando se construya la página `/store` real (hoy también vacía, mismo estado que `/team`).

## Objetivo

- Nueva sección `StoreHighlight` en el home, después de `CoachingBanner`.
- Muestra hasta 3 productos (`getProducts().slice(0, 3)`), grid centrado (no se estira a ancho completo con pocos productos).
- Botón "Ver más" alineado a la derecha bajo el grid → `ROUTES.store`.
- `ProductCard` implementado como preview: imagen (o placeholder), badge de categoría, badge "Destacado" si `featured`, nombre, precio formateado, toda la card es un enlace a `/store`.
- Fondo `--bg-surface`, continuando la alternancia de fondos par/impar entre secciones del home (ver spec previo de ajuste de `team-highlight`, que también usa `--bg-surface`).

## Fuera de scope

- `SizeSelector` y `CheckoutButton` siguen sin implementar — no se tocan en esta tarea.
- `/store` sigue vacío; el botón "Ver más" y la card enlazan ahí igualmente, sin contenido todavía (gap aceptado, igual que con `/team`).
- No se sube ninguna imagen real a `public/images/store/` — las rutas del JSON (`/images/store/jersey-front.jpg`) no resuelven a un archivo existente; se trata como "imagen rota" graceful (ver más abajo), no se soluciona aquí.
- No se modifica `lib/inventory.ts` ni `content/stock.json`.

## Componente: `StoreHighlight`

Ubicación: `src/features/home/components/store-highlight/` (carpeta nueva, sigue la convención `kebab-case/PascalCase.tsx` + barrel `index.ts`).

- `StoreHighlight.tsx`: `"use client"`. Importa `getProducts` desde `@/features/store`, `ProductCard` desde `@/features/store`, `SectionHeader`/`Button` desde `@/components/ui`, `ROUTES` desde `@config/routes`, `useTranslations` de `next-intl`.
- Misma estructura que `TeamHighlight`: `<section className="store-highlight">` → `<div className="store-highlight__inner">` → `SectionHeader namespace="home.storeHighlight"` → `<div className="store-highlight__grid">` con `products.slice(0, 3).map(...)` → `<div className="store-highlight__footer">` con el `Button`.
- Añadido a `src/app/[locale]/page.tsx`, después de `<CoachingBanner />`.
- Exportado desde `src/features/home/components/index.ts` y el barrel `src/features/home/index.ts` (ya re-exporta `./components`, sin cambios ahí).

## Componente: `ProductCard` (implementación real, reemplaza el stub)

Ubicación: `src/features/store/components/ProductCard.tsx` (ya existe, se reescribe por completo).

- `"use client"`. Recibe `{ product: Product }`.
- Usa `useFormatter()` de `next-intl` para el precio: `format.number(product.price, { style: "currency", currency: product.currency })` — locale-aware, sin hardcodear el símbolo `€`/`$`.
- Usa `useTranslations("home.productCard")` para las labels de categoría y el badge "Destacado".
- Toda la card es un `Link` (`@/i18n/navigation`) a `ROUTES.store`.
- Estructura:
  - `<article className="product-card">` conteniendo un `<Link>` que envuelve todo.
  - Imagen: `product.images[0]` con `next/image` `fill`, igual patrón que `PlayerCard` (`object-fit: cover`); si `images[0]` no existe (string vacío/undefined) se muestra un placeholder `?` (mismo patrón visual que `player-card__no-image`). Si la ruta existe pero el archivo físico no (caso actual del Jersey), `next/image` simplemente no resuelve — comportamiento aceptado, no se gestiona con JS adicional (no hay `onError` ya que `next/image` no soporta fallback dinámico sin estado adicional, y no es necesario para esta tarea).
  - Badges superiores: categoría (`t(\`category_${product.category}\`)`) y, si `product.featured`, badge "Destacado" (`t("featured_badge")`).
  - Nombre (`product.name`) y precio formateado.

## Copy (es / en)

Nuevo namespace `home.storeHighlight` en `messages/es.json` y `messages/en.json` (mismo nivel que `teamHighlight`/`coachingBanner`):
- `eyebrow`: "La Tienda" / "The Store"
- `title`: "Viste los colores de Crow6" / "Wear the Crow6 colors"
- `subtitle`: "Equipación oficial pensada para el equipo y la afición." / "Official gear designed for the team and the fans."
- `cta_view_more`: "Ver más" / "View more"

Nuevo namespace `home.productCard`:
- `category_jersey`: "Camiseta" / "Jersey"
- `category_hoodie`: "Sudadera" / "Hoodie"
- `category_cap`: "Gorra" / "Cap"
- `category_accessory`: "Accesorio" / "Accessory"
- `featured_badge`: "Destacado" / "Featured"

## Estilos

`src/features/home/components/store-highlight/store-highlight.scss`: mismo esqueleto que `team-highlight.scss` (sección + inner + responsive scroll-snap en mobile), con estas diferencias:
- `.store-highlight { background: var(--bg-surface); }` (fondo continuando la alternancia).
- `.store-highlight__grid`: `grid-template-columns: repeat(auto-fit, minmax(260px, 320px)); justify-content: center;` (centrado, no estira con pocos productos — el patrón que `team-highlight` tenía antes del ajuste de hoy).
- `.store-highlight__footer`: igual que `team-highlight__footer` (`display: flex; justify-content: flex-end;`).

`src/features/store/components/product-card.scss` (nuevo): estilo visual similar a `coaching-pack` (fondo `--bg-surface`/`--bg-raised`, borde `--border-subtle`, sin `border-radius` grande, acorde a la identidad angulosa del proyecto) — imagen con `aspect-ratio` fija, badges superpuestos arriba igual que `player-card__top`, nombre y precio en la zona inferior.
