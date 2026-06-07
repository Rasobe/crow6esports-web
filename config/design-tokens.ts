/**
 * CROW6 Esports — Design Tokens (TypeScript)
 *
 * Estas constantes son la fuente de verdad TS/JS.
 * Los valores DEBEN coincidir con las CSS custom properties de globals.css.
 *
 * Úsalos en lógica JS (e.g. Chart.js, canvas, generación dinámica de estilos).
 * Para componentes React usa directamente las CSS vars vía `style={{ color: "var(--brand)" }}`.
 */

export const colors = {
  brand:      "#F5B800",   // var(--brand)
  brandHover: "#FFD040",   // var(--brand-hover)
  brandDark:  "#C99700",   // var(--brand-dark)
  brandFg:    "#0A0A0A",   // var(--brand-fg)  — texto sobre dorado

  bgBase:     "#0A0A0A",   // var(--bg-base)
  bgSurface:  "#141414",   // var(--bg-surface)
  bgRaised:   "#1E1E1E",   // var(--bg-raised)

  textPrimary:   "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.70)",
  textMuted:     "rgba(255,255,255,0.40)",
} as const;

export const layout = {
  navbarH:   "68px",
  container: "1280px",
  radius:    "0.5rem",
} as const;

export const typography = {
  fontSans: "var(--font-geist-sans)",
  fontMono: "var(--font-geist-mono)",
} as const;

export type ColorKey = keyof typeof colors;
