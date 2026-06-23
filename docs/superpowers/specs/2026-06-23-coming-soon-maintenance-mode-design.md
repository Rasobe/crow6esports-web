# Modo mantenimiento / coming soon

**Fecha:** 2026-06-23
**Rama:** `main`

## Objetivo

Permitir bloquear el acceso a todas las páginas del sitio (excepto la propia
pantalla de mantenimiento) mostrando una pantalla "coming soon" con el logo y
la identidad visual de Crow 6 Esports, activable/desactivable sin tocar ni
borrar páginas existentes.

## Mecanismo de bloqueo

- Variable de entorno `NEXT_PUBLIC_MAINTENANCE_MODE` (`"true"` / `"false"`).
- En `proxy.ts`, antes de delegar en `createMiddleware(routing)` (next-intl):
  - Si `process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"` y la ruta solicitada no es
    `/coming-soon`, se hace `NextResponse.rewrite` hacia `/coming-soon`. La
    URL visible para el usuario no cambia.
  - Si la variable no está activa, el comportamiento es exactamente el
    actual (sin cambios).
- El `matcher` existente ya excluye `/api`, `/_next`, `/_vercel` y archivos
  estáticos, así que esas rutas siguen funcionando igual en ambos casos.
- Activar/desactivar el modo mantenimiento es solo cambiar el valor de la
  variable de entorno; no requiere despliegue de código adicional ni borrar
  páginas.

## Página `/coming-soon`

- Ruta: `src/app/coming-soon/page.tsx`, a nivel raíz de `src/app`, **fuera**
  del segmento `[locale]`. Esto la excluye automáticamente del
  `Navbar`/`Footer` definidos en `src/app/[locale]/layout.tsx`, pero sigue
  heredando `src/app/layout.tsx` (fuentes, estilos globales).
- `export const metadata` con título fijo y `robots: { index: false, follow: false }`
  para evitar indexación de una página temporal.
- Componente: `src/features/coming-soon/components/ComingSoonPage.tsx` +
  `coming-soon.scss`, con barrel `index.ts`, siguiendo la convención de
  carpetas del proyecto (kebab-case carpeta, PascalCase componente, estilos
  colocados).
- Contenido, en español fijo (sin next-intl, decisión explícita: esta
  pantalla vive fuera del árbol `[locale]` y no necesita soporte bilingüe):
  - Logo `/images/brand/crow6-wordmark.svg` centrado, en mayor tamaño que en
    el `Navbar`.
  - Eyebrow: "ESTAMOS PREPARANDO ALGO" (estilo `--brand`, mayúsculas,
    letter-spacing, como en `page-header.scss`).
  - Título: "PRÓXIMAMENTE" con `var(--font-display)`.
  - Descripción corta con `var(--font-body)`, color `--text-secondary`.
- Estilo: pantalla completa (`min-height: 100vh`), fondo `--bg-base`,
  contenido centrado, con un acento dorado (`--brand`) reutilizando el
  lenguaje visual de `page-header.scss` (línea o borde, sin
  `border-radius`, ángulos rectos).

## Fuera de alcance

- No se modifica ni crea ningún archivo `.env`. El usuario debe añadir
  `NEXT_PUBLIC_MAINTENANCE_MODE=true` manualmente en su entorno local y/o en el panel de
  variables de entorno de despliegue (Vercel) cuando quiera activar el modo.
- No se borra ni reestructura ninguna página existente.
- No se añade soporte bilingüe a la pantalla de mantenimiento.
