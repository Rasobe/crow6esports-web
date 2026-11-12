/**
 * Ahrefs Web Analytics: sin cookies ni datos personales, así que no necesita banner de
 * consentimiento. La clave es pública (va en el HTML). Se activa con ANALYTICS_ENABLED.
 */
export const AHREFS_ANALYTICS = {
  origin: "https://analytics.ahrefs.com",
  src: "https://analytics.ahrefs.com/analytics.js",
  // Clave pública del sitio, no un secreto: gitleaks la confunde con una API key
  key: "32KLrCaEbsEpmorO2gfy/A", // gitleaks:allow
} as const;
