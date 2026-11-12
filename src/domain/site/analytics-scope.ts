import { isAdminPath } from "@/domain/admin/admin-access";
import { isKeystaticPath } from "@/domain/keystatic/keystatic-access";

const LOGIN_PREFIX = "/login";

interface AnalyticsScopeInput {
  /** El interruptor del entorno: solo producción lo activa. */
  enabled: boolean;
  /** La ruta pedida (antes de cualquier rewrite). */
  pathname: string;
}

const isLoginPath = (pathname: string) => {
  const path = pathname
    .toLowerCase()
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "");
  return path === LOGIN_PREFIX || path.startsWith(`${LOGIN_PREFIX}/`);
};

/** La analítica mide la web pública: nunca los paneles privados ni sus pantallas de acceso. */
export function shouldLoadAnalytics({ enabled, pathname }: AnalyticsScopeInput): boolean {
  if (!enabled) return false;
  return !isAdminPath(pathname) && !isKeystaticPath(pathname) && !isLoginPath(pathname);
}
