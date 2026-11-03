// En producción Vercel sirve sus scripts de analítica desde el propio dominio; en
// desarrollo las versiones de depuración llegan desde estos.
const VERCEL_DEV_SCRIPT_HOSTS = "https://cdn.vercel-insights.com https://va.vercel-scripts.com";

/**
 * Content Security Policy. Scripts and styles allow 'unsafe-inline' because the hydration
 * script of the islands, the motion bootstrap and the `<ClientRouter />` transitions run
 * inline, and Astro's built-in hashed CSP does not support the ClientRouter. Everything
 * else is locked to the site itself plus the YouTube player.
 */
function contentSecurityPolicy(isDev: boolean): string {
  const devHosts = isDev ? ` ${VERCEL_DEV_SCRIPT_HOSTS}` : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${devHosts}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${devHosts}`,
    "frame-src https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export function createSecurityHeaders(isDev = false): Readonly<Record<string, string>> {
  return {
    "Content-Security-Policy": contentSecurityPolicy(isDev),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  };
}

export function applySecurityHeaders(response: Response, isDev = false): Response {
  for (const [name, value] of Object.entries(createSecurityHeaders(isDev))) {
    if (!response.headers.has(name)) response.headers.set(name, value);
  }
  return response;
}
