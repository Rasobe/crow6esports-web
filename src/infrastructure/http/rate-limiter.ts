export interface RateLimiter {
  /** Registers a hit for the key and returns how many ms remain until it may retry, or 0 if allowed. */
  hit(key: string): number;
}

interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

const MAX_TRACKED_KEYS = 5_000;

/**
 * Best-effort sliding window limiter kept in memory. Serverless instances do not share
 * state, so it only slows down naive bursts; the platform firewall is the real barrier.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: RateLimiterOptions): RateLimiter {
  const hitsByKey = new Map<string, number[]>();

  function prune(timestamp: number) {
    if (hitsByKey.size < MAX_TRACKED_KEYS) return;
    for (const [key, hits] of hitsByKey) {
      if (hits.every((hit) => timestamp - hit >= windowMs)) hitsByKey.delete(key);
    }
  }

  return {
    hit(key) {
      const timestamp = now();
      prune(timestamp);

      const recent = (hitsByKey.get(key) ?? []).filter((hit) => timestamp - hit < windowMs);
      if (recent.length >= limit) {
        hitsByKey.set(key, recent);
        return windowMs - (timestamp - recent[0]);
      }

      hitsByKey.set(key, [...recent, timestamp]);
      return 0;
    },
  };
}
