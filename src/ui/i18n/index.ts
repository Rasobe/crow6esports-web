import en from "./locales/en.json";
import es from "./locales/es.json";

export const LOCALES = ["es", "en"] as const;
export const DEFAULT_LOCALE = "es";

export type Locale = (typeof LOCALES)[number];
export type TranslationParams = Record<string, string | number>;
export type Translate = (key: string, params?: TranslationParams) => string;

const MESSAGES: Record<Locale, unknown> = { es, en };

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function detectLocale(acceptLanguage: string | null): Locale {
  return acceptLanguage?.toLowerCase().startsWith("es") ? "es" : "en";
}

function resolveMessage(messages: unknown, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (node, segment) => (node as Record<string, unknown> | undefined)?.[segment],
      messages,
    );

  return typeof value === "string" ? value : path;
}

function interpolate(message: string, params?: TranslationParams): string {
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}

export function createTranslator(locale: Locale, namespace?: string): Translate {
  return (key, params) => {
    const path = namespace ? `${namespace}.${key}` : key;
    return interpolate(resolveMessage(MESSAGES[locale], path), params);
  };
}

export function localizePath(locale: Locale, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`), "");
  return stripped === "" ? "/" : stripped;
}

export function formatCurrency(locale: Locale, amount: number, currency: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}
