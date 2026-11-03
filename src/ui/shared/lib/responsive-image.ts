/** Anchos que se generan para cada imagen de la tienda (`nombre-400.webp`, `-560`, `-720`). */
export const STORE_IMAGE_WIDTHS = [400, 560, 720] as const;

const withWidth = (src: string, width: number) => src.replace(/\.webp$/, `-${width}.webp`);

/** `srcset` con las variantes de una imagen de la tienda, para que cada pantalla baje la justa. */
export function storeImageSrcset(src: string): string {
  return STORE_IMAGE_WIDTHS.map((width) => `${withWidth(src, width)} ${width}w`).join(", ");
}

export function storeImageVariants(src: string): string[] {
  return STORE_IMAGE_WIDTHS.map((width) => withWidth(src, width));
}
