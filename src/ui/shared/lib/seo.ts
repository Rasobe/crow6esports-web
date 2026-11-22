export const TITLE_SEPARATOR = " · ";

/**
 * Título final de la pestaña y de las tarjetas sociales: "%s · Marca". Un título absoluto
 * (el de la home) ya lleva la marca y se usa tal cual; sin título solo queda la marca.
 */
export function buildPageTitle(title: string | undefined, brand: string, absolute = false): string {
  if (!title) return brand;
  // Los titulares de noticias ya nombran al club: repetirlo pasaba de los 60 caracteres
  // que muestra Google y la marca quedaba cortada.
  if (absolute || title.includes(brand)) return title;
  return `${title}${TITLE_SEPARATOR}${brand}`;
}
