# CoachingBanner — Rediseño con pricing anchor

## Contexto

`CoachingBanner` (`src/features/home/components/coaching-banner/`) muestra 3 packs de coaching sin estilos propios para `.coaching-pack` / `.coaching-pack--featured` y sin precios, features ni dato de credibilidad. El objetivo es convertirlo en un bloque de pricing profesional que use el efecto ancla clásico: el pack del medio (destacado) debe parecer la mejor opción frente a los packs que lo flanquean.

## Objetivo

- Headline existente se mantiene: `home.coachingBanner.title` = "Lleva tu juego al siguiente nivel" (ya está en `messages/*.json`, no requiere cambios).
- Dato de credibilidad visible antes de los packs.
- 3 packs con precio, descripción corta y lista de features, con el pack destacado (55€) elevado visualmente sobre el básico (28€) y el premium (78€).
- Un único CTA final "Reservar sesión" → `/coaching` (ya existente, sin cambios de lógica).

## Estructura visual

- `SectionHeader` (sin cambios) seguido de un badge/línea de credibilidad: "3 años formando jugadores hasta 1900+ MMR".
- Grid de 3 packs en desktop (`display: grid`, 3 columnas), con `.coaching-pack--featured` escalado/elevado (mayor padding, borde o fondo distintivo, badge "Más elegido").
- En mobile: scroll horizontal con snap, igual que `team-highlight` (patrón ya existente en el proyecto), mostrando el pack destacado en primer lugar.
- Cada pack: título, precio, descripción corta en cursiva/subrayada, lista de features (`<ul>`).
- Footer del banner con el `Button` CTA existente, sin cambios.

## Copy (es / en)

Nuevas keys bajo `home.coachingBanner` en `messages/es.json` y `messages/en.json`:

- `credibility`: "3 años formando jugadores hasta 1900+ MMR" / "3 years training players up to 1900+ MMR"
- `pack_1_title`: "Pack Básico" / "Basic Pack"
- `pack_1_price`: "28€/mes" / "€28/month"
- `pack_1_description`: "Ideal para empezar a pulir tu mecánica y tus decisiones en partido." / "Ideal for starting to sharpen your mechanics and in-game decisions."
- `pack_1_feature_1..3`: 1 sesión semanal (60 min) / 1 weekly session (60 min); Feedback de tu última partida ranked / Feedback on your latest ranked match; Acceso al Discord de la academia / Access to the academy Discord
- `pack_2_badge`: "Más elegido" / "Most popular"
- `pack_2_title`: "Pack Destacado" / "Featured Pack"
- `pack_2_price`: "55€/mes" / "€55/month"
- `pack_2_description`: "El equilibrio perfecto entre seguimiento constante y precio." / "The perfect balance between consistent coaching and price."
- `pack_2_feature_1..4`: 2 sesiones semanales (60 min) / 2 weekly sessions (60 min); Análisis de replays personalizado / Personalized replay analysis; Plan de mejora mensual / Monthly improvement plan; Acceso prioritario a horarios / Priority scheduling access
- `pack_3_title`: "Pack Premium" / "Premium Pack"
- `pack_3_price`: "78€/mes" / "€78/month"
- `pack_3_description`: "Entrenamiento intensivo para quien compite al máximo nivel." / "Intensive training for those competing at the highest level."
- `pack_3_feature_1..4`: 3 sesiones semanales (60 min) / 3 weekly sessions (60 min); Análisis de VOD ilimitado / Unlimited VOD analysis; Seguimiento 1 a 1 por Discord / 1-on-1 follow-up on Discord; Sesión mensual con el equipo de analistas / Monthly session with the analyst team

`cta_reserve` ya existe en `es.json`; falta en `en.json` (se añade: "Book a session").

## Componente

- `CoachingBanner.tsx`: elimina el import sin uso de `next/link` (ya no se usa, el `Button` usa internamente `@/i18n/navigation`). Sustituye los 3 bloques de pack hardcodeados por un array de datos (`packs`) con `id`, `featured`, número de features, mapeado en JSX — evita repetir el mismo bloque 3 veces y facilita mantener orden/feature count distinto por pack.
- Añade el bloque de credibilidad entre `SectionHeader` y `.coaching-banner__packs`.
- Cada pack feature list usa `<ul><li>`.

## Estilos (`coaching-banner.scss`)

- Define `.coaching-banner__credibility` (badge/línea destacada).
- Define `.coaching-banner__packs` como CSS grid de 3 columnas en desktop; scroll horizontal con snap en mobile (mismo patrón que `team-highlight`).
- Define `.coaching-pack` (borde sutil, padding) y `.coaching-pack--featured` (escala/elevación, borde o fondo de acento, posicionamiento del badge "Más elegido").
- Sigue los tokens de `src/styles/_tokens.scss` para colores/espaciados, consistente con la identidad visual angulosa de alto contraste del proyecto.

## Fuera de scope

- No se toca `Button`, `SectionHeader`, ROUTES ni lógica de Stripe/checkout — el CTA solo enlaza a `/coaching`, no inicia un pago.
- No se añade lógica de selección de pack ni estado interactivo: es un bloque informativo + CTA único.
