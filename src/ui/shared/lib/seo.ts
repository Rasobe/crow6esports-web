export const TITLE_SEPARATOR = " · ";

/**
 * Título final de la pestaña y de las tarjetas sociales: "%s · Marca". Un título absoluto
 * (el de la home) ya lleva la marca y se usa tal cual; sin título solo queda la marca.
 */
export function buildPageTitle(title: string | undefined, brand: string, absolute = false): string {
  if (!title) return brand;
  return absolute ? title : `${title}${TITLE_SEPARATOR}${brand}`;
}
