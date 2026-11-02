export const MAX_JSON_BODY_BYTES = 32 * 1024;

export function isJsonRequest(request: Request): boolean {
  return request.headers.get("content-type")?.toLowerCase().startsWith("application/json") ?? false;
}

/** Browsers always send Origin on cross-site POSTs; a mismatch means the call came from another site. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

export type JsonBodyResult =
  { ok: true; value: unknown } | { ok: false; reason: "too_large" | "invalid_json" };

export async function readJsonBody(
  request: Request,
  maxBytes = MAX_JSON_BODY_BYTES,
): Promise<JsonBodyResult> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > maxBytes) return { ok: false, reason: "too_large" };

  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) return { ok: false, reason: "too_large" };

  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, reason: "invalid_json" };
  }
}
