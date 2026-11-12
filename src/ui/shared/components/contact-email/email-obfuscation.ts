const reverse = (value: string) => [...value].reverse().join("");

/**
 * Codifica el email para que no aparezca en claro en el HTML (lo buscan los rastreadores de
 * spam y lo señalan las auditorías SEO). No es cifrado: solo evita la lectura directa.
 */
export function encodeEmail(email: string): string {
  return btoa(reverse(email));
}

export function decodeEmail(encoded: string): string {
  return reverse(atob(encoded));
}
