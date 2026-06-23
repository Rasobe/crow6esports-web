# TeamHighlight — Mostrar solo 3 jugadores + botón "Ver más"

## Contexto

`TeamHighlight` (`src/features/home/components/team-highlight/TeamHighlight.tsx`) renderiza actualmente **todos** los jugadores devueltos por `getPlayers()` en el grid del home. Con el roster creciendo, el objetivo es limitar el home a un vistazo y enviar al usuario a la página de equipo completa para ver el resto.

## Objetivo

- El home muestra como máximo 3 cards de jugador.
- Debajo del grid, un botón "Ver más" alineado a la derecha que enlaza a `ROUTES.team` (`/team`).
- Sin cambios en `lib/players.ts` (`getPlayers`/`getActivePlayers` no se tocan) — el slice ocurre en el componente.

## Fuera de scope

- `/team` (`src/app/[locale]/team/page.tsx`) está vacía hoy (solo metadata, sin contenido). El botón enlazará ahí igualmente, pero implementar esa página queda fuera de este cambio.
- No se cambia el criterio de qué jugadores existen ni su orden en `content/players.json`.

## Componente

`TeamHighlight.tsx`:
- `players.slice(0, 3)` para el array que se mapea en `.team-highlight__grid` (la constante `players` module-level con `getPlayers()` se mantiene igual; el slice se aplica al usarla en el JSX).
- Nuevo bloque `<div className="team-highlight__footer">` después de `.team-highlight__grid`, con un `Button` (`@/components/ui`) `variant="outline"` `href={ROUTES.team}`, texto `t("cta_view_more")`.
- Import nuevo: `Button` desde `@/components/ui`, `ROUTES` desde `@config/routes`.

## Copy (es / en)

Nueva key en `home.teamHighlight` en ambos `messages/*.json`:
- `cta_view_more`: "Ver más" / "View more"

## Estilos (`team-highlight.scss`)

- Nuevo `.team-highlight__footer`: `display: flex; justify-content: flex-end;` debajo de `.team-highlight__grid`, dentro de `.team-highlight__inner` (hereda el `gap: 56px` del flex column existente — sin gap extra).
- Sin cambios en `.team-highlight__grid` ni en el bloque responsive de scroll-snap (≤640px): el footer se mantiene alineado a la derecha también en mobile.
