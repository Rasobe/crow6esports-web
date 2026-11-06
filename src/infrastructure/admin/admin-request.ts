const MAX_FORM_BYTES = 16 * 1024;

/** Writes from the panel must come from the panel itself: Origin is required and must match. */
export function isSameOriginStrict(request: Request): boolean {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export const redirectTo = (location: string): Response =>
  new Response(null, { status: 303, headers: { Location: location, "Cache-Control": "no-store" } });

export const jsonError = (error: string, status: number): Response =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/** Reads a small urlencoded form body as plain strings. Null when it is missing or too big. */
export async function readFormFields(request: Request): Promise<Record<string, string> | null> {
  if (Number(request.headers.get("content-length")) > MAX_FORM_BYTES) return null;

  try {
    const form = await request.formData();
    const fields: Record<string, string> = {};
    for (const [name, value] of form) {
      if (typeof value === "string") fields[name] = value;
    }
    return fields;
  } catch {
    return null;
  }
}
