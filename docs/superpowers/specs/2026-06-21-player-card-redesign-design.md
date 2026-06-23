# PlayerCard: limpieza de modelo y rediseño visual

## Contexto

El `PlayerCard` que se usa hoy en producción vive en `src/components/ui/player-card/PlayerCard.tsx` (consumido por `TeamHighlight` en la home). Al revisarlo aparecieron varios problemas:

- `src/features/team/components/PlayerCard.tsx` y `RosterGrid.tsx` son stubs sin uso que importan un módulo `../types` inexistente — código muerto y roto, dejado como placeholder de la futura página `/team`.
- El modelo `Player` (`src/types/Player.ts`) define `stats.rank` y `socials.rltracker`, pero la card nunca los muestra.
- `socialLinks` se filtra con `.filter(s => s.href && !s.href.includes("..."))` — un parche para datos placeholder que ya no existen en `content/players.json`.
- `stats.mmr` / `stats.peak` se formatean con `toLocaleString("en-US")` fijo, ignorando el locale activo (es/en) pese a que el sitio es bilingüe vía next-intl.
- La clave de traducción `playerCard.no_socials` existe en `messages/es.json` y `messages/en.json` pero no se usa en ningún sitio.

## Objetivo

1. Eliminar el código muerto/roto.
2. Mostrar rango y RLTracker, que ya están en el modelo.
3. Corregir el formato de número y simplificar la construcción de `socialLinks`.
4. Aplicar una evolución visual del estilo actual (no un rediseño desde cero), validada con mockups: badge de rango junto al de rol, dorado de marca para todos los tiers, sin mapeo de color por rango.

## Alcance

### Eliminar

- `src/features/team/components/PlayerCard.tsx`
- `src/features/team/components/RosterGrid.tsx`
- Si tras eliminarlos `src/features/team/components/` queda vacío, eliminar también la carpeta.
- La clave `playerCard.no_socials` de `messages/es.json` y `messages/en.json`.

### Modelo (`src/types/Player.ts`)

- `PlayerStats.rank` pasa de opcional (`rank?: string`) a obligatorio (`rank: string`). Todos los registros de `content/players.json` ya lo incluyen; si en el futuro se añade un jugador sin rango, debe fallar en build-time, no quedar oculto en runtime.

### Componente `PlayerCard` (`src/components/ui/player-card/PlayerCard.tsx`)

**Datos nuevos mostrados:**
- Badge de rango (`stats.rank`) en la franja superior, junto al badge de rol — mismo tratamiento visual que el badge de `status` (pill, fondo translúcido, borde sutil), con un punto dorado indicador. Color siempre dorado de marca (`--brand`), sin variación por tier.
- Enlace a RLTracker (`socials.rltracker`) añadido al array de redes, mismo trato que el resto (icono, `target="_blank"`, `rel="noopener noreferrer"`).

**Correcciones:**
- `socialLinks` se construye iterando un array de claves (`twitter`, `instagram`, `twitch`, `tiktok`, `youtube`, `rltracker`) con su icono y label asociados, en vez de seis objetos casi idénticos escritos a mano. Filtro: `Boolean(s.href)` (se elimina el `.includes("...")`).
- El formato de `mmr`/`peak` usa el locale activo de next-intl (`useLocale()`) en vez de `"en-US"` fijo.
- Si un jugador no tiene ninguna red social, la fila de redes simplemente no se renderiza (comportamiento ya existente; se confirma como definitivo, de ahí que se elimine `no_socials`).

**Visual:**
- Misma estructura general de la card (fondo con imagen/placeholder, overlay degradado, cuerpo con nickname + stats + redes, corner accent decorativo). No se reescribe el layout.
- Franja superior (`.player-card__top`) pasa a alojar dos badges: rol (igual que hoy) y rango (nuevo, estilo similar al de `status` pero con el punto dorado). Si hay `status` además de rol y rango, los tres conviven en la misma franja — usar `flex-wrap` si no caben en una línea en mobile.
- Ajustar paddings/gaps en `.player-card__top` y `.player-card__body` lo mínimo necesario para que el nuevo badge no se sienta apretado.

**Sin cambios:** `getAge`, manejo de `anonymous`, estructura de archivos (`PlayerCard.tsx` + `player-card.scss` + `index.ts`), resto de clases CSS.

## Fuera de alcance

- No se construye la página `/team` ni `RosterGrid` real (queda pendiente, fuera de esta tarea).
- No se implementa color por tier de rango.
- No se añaden fotos reales de jugadores (sigue usando el placeholder cuando `image` es `null`).
