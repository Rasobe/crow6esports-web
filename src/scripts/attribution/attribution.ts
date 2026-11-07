import { ATTRIBUTION_MAX, type Attribution } from "@/domain/tryouts/attribution";

const STORAGE_KEY = "crow6.attribution";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

interface PageVisit {
  href: string;
  referrer: string;
}

const clean = (value: string | null | undefined, max: number) => {
  const trimmed = value?.trim().slice(0, max);
  return trimmed || undefined;
};

/** Origin and path only: the query and hash of a referrer can carry personal data. */
function referrerOf({ href, referrer }: PageVisit): string | undefined {
  try {
    const from = new URL(referrer);
    // A link from the site itself says nothing about where the visitor came from
    if (from.origin === new URL(href).origin) return undefined;
    return clean(`${from.origin}${from.pathname}`, ATTRIBUTION_MAX.referrer);
  } catch {
    return undefined;
  }
}

export function buildAttribution(visit: PageVisit): Attribution {
  let url: URL;
  try {
    url = new URL(visit.href);
  } catch {
    return {};
  }

  // UTM values are lowercased so "Instagram" and "instagram" count as one source
  const utm = (name: string) =>
    clean(url.searchParams.get(name), ATTRIBUTION_MAX.utm)?.toLowerCase();

  return {
    sourcePage: clean(url.pathname, ATTRIBUTION_MAX.page),
    referrer: referrerOf(visit),
    utmSource: utm("utm_source"),
    utmMedium: utm("utm_medium"),
    utmCampaign: utm("utm_campaign"),
  };
}

const STORED_KEYS = ["sourcePage", "referrer", "utmSource", "utmMedium", "utmCampaign"] as const;

function readStored(storage: StorageLike): Attribution | undefined {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return undefined;

    // Only known string fields come back, whatever else the storage holds
    const record = parsed as Record<string, unknown>;
    const max = (key: (typeof STORED_KEYS)[number]) =>
      key === "sourcePage"
        ? ATTRIBUTION_MAX.page
        : key === "referrer"
          ? ATTRIBUTION_MAX.referrer
          : ATTRIBUTION_MAX.utm;
    return Object.fromEntries(
      STORED_KEYS.flatMap((key) => {
        const value = record[key];
        return typeof value === "string" && value ? [[key, value.slice(0, max(key))]] : [];
      }),
    );
  } catch {
    return undefined;
  }
}

/**
 * Attribution of the first page of the session. It is stored once, on the first visit, so a
 * later navigation inside the site never overwrites where the visitor came from. Storage may
 * be missing or blocked: then the current page is used and nothing breaks.
 */
export function captureAttribution(visit: PageVisit, storage: StorageLike | null): Attribution {
  const stored = storage ? readStored(storage) : undefined;
  if (stored) return stored;

  const attribution = buildAttribution(visit);
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Private mode or quota: the attribution still travels with this submission
  }
  return attribution;
}

function browserStorage(): StorageLike | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function captureBrowserAttribution(): Attribution {
  return captureAttribution(
    { href: window.location.href, referrer: document.referrer },
    browserStorage(),
  );
}
