import en from "./locales/en.json";
import es from "./locales/es.json";

export const LOCALES = ["es", "en"] as const;
export const DEFAULT_LOCALE = "es";

export type Locale = (typeof LOCALES)[number];
export type TranslationParams = Record<string, string | number>;
export type Messages = { [key: string]: string | Messages };
export type Translate = (key: string, params?: TranslationParams) => string;

const MESSAGES: Record<Locale, unknown> = { es, en };

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function detectLocale(acceptLanguage: string | null): Locale {
  return acceptLanguage?.toLowerCase().startsWith("es") ? "es" : "en";
}

function lookup(messages: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (node, segment) => (node as Record<string, unknown> | undefined)?.[segment],
      messages,
    );
}

function interpolate(message: string, params?: TranslationParams): string {
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}

export function createMessageTranslator(messages: unknown, namespace?: string): Translate {
  return (key, params) => {
    const path = namespace ? `${namespace}.${key}` : key;
    const value = lookup(messages, path);
    return interpolate(typeof value === "string" ? value : path, params);
  };
}

export function createTranslator(locale: Locale, namespace?: string): Translate {
  return createMessageTranslator(MESSAGES[locale], namespace);
}

/** Serializable slice of the messages, meant to be passed as a prop to client islands. */
export function getMessages(locale: Locale, namespace: string): Messages {
  return lookup(MESSAGES[locale], namespace) as Messages;
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
