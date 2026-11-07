// En producción Vercel sirve sus scripts de analítica desde el propio dominio; en
// desarrollo las versiones de depuración llegan desde estos.
// El panel de Keystatic habla con la API de GitHub desde el navegador, muestra avatares e
// imágenes del repositorio, carga su tipografía (Inter) de Google Fonts y su asistente envía
// a github.com el formulario que crea la GitHub App
const KEYSTATIC_CONNECT_HOSTS = "https://api.github.com";
const KEYSTATIC_STYLE_HOSTS = "https://fonts.googleapis.com";
const KEYSTATIC_FONT_HOSTS = "https://fonts.gstatic.com";
const KEYSTATIC_FORM_HOSTS = "https://github.com";
const KEYSTATIC_IMAGE_HOSTS =
  "https://avatars.githubusercontent.com https://raw.githubusercontent.com";

const VERCEL_DEV_SCRIPT_HOSTS = "https://cdn.vercel-insights.com https://va.vercel-scripts.com";

/**
 * Content Security Policy. Scripts and styles allow 'unsafe-inline' because the hydration
 * script of the islands, the motion bootstrap and the `<ClientRouter />` transitions run
 * inline, and Astro's built-in hashed CSP does not support the ClientRouter. Everything
 * else is locked to the site itself plus the YouTube player.
 */
function contentSecurityPolicy(isDev: boolean, panel: boolean): string {
  const devHosts = isDev ? ` ${VERCEL_DEV_SCRIPT_HOSTS}` : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${devHosts}`,
    panel
      ? `style-src 'self' 'unsafe-inline' ${KEYSTATIC_STYLE_HOSTS}`
      : "style-src 'self' 'unsafe-inline'",
    panel ? `img-src 'self' data: blob: ${KEYSTATIC_IMAGE_HOSTS}` : "img-src 'self' data:",
    panel ? `font-src 'self' ${KEYSTATIC_FONT_HOSTS}` : "font-src 'self'",
    panel ? `connect-src 'self' ${KEYSTATIC_CONNECT_HOSTS}` : `connect-src 'self'${devHosts}`,
    "frame-src https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    panel ? `form-action 'self' ${KEYSTATIC_FORM_HOSTS}` : "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export function createSecurityHeaders(
  isDev = false,
  panel = false,
): Readonly<Record<string, string>> {
  return {
    "Content-Security-Policy": contentSecurityPolicy(isDev, panel),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  };
}

export function applySecurityHeaders(response: Response, isDev = false, panel = false): Response {
  for (const [name, value] of Object.entries(createSecurityHeaders(isDev, panel))) {
    if (!response.headers.has(name)) response.headers.set(name, value);
  }
  return response;
}
