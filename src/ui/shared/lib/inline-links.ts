export type InlineSegment<Key extends string> =
  { kind: "text"; text: string } | { kind: "link"; text: string; key: Key };

const LINK_PATTERN = /\[([^\]]+)\]\((\w+)\)/g;

/**
 * Parte un texto traducido con enlaces `[etiqueta](clave)` en tramos de texto y de enlace,
 * para que cada idioma coloque los enlaces donde encajen sin meter rutas en las traducciones.
 * Una clave desconocida deja la etiqueta como texto plano.
 */
export function splitInlineLinks<Key extends string>(
  message: string,
  keys: readonly Key[],
): InlineSegment<Key>[] {
  const segments: InlineSegment<Key>[] = [];
  let cursor = 0;

  const pushText = (text: string) => {
    if (!text) return;
    const last = segments.at(-1);
    if (last?.kind === "text") last.text += text;
    else segments.push({ kind: "text", text });
  };

  for (const match of message.matchAll(LINK_PATTERN)) {
    const [whole, text, key] = match;
    pushText(message.slice(cursor, match.index));
    if ((keys as readonly string[]).includes(key)) {
      segments.push({ kind: "link", text, key: key as Key });
    } else {
      pushText(text);
    }
    cursor = match.index + whole.length;
  }
  pushText(message.slice(cursor));

  return segments;
}
