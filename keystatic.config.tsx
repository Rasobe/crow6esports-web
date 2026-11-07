import { collection, config, fields } from "@keystatic/core";
import { REPOSITORY } from "./config/repository";

export const EXCERPT_MAX = 160;

export default config({
  // Local en desarrollo; en producción commitea al repositorio con login de GitHub
  storage: import.meta.env.PROD
    ? { kind: "github", repo: `${REPOSITORY.owner}/${REPOSITORY.name}` }
    : { kind: "local" },
  ui: { brand: { name: "Crow 6 eSports" } },
  collections: {
    news: collection({
      label: "Noticias",
      slugField: "title",
      path: "content/news/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({
          name: { label: "Título", validation: { length: { min: 1, max: 120 } } },
          slug: {
            label: "Slug",
            description:
              "Va en la URL. Debe ser único entre todos los idiomas: usa uno distinto por traducción.",
          },
        }),
        locale: fields.select({
          label: "Idioma",
          description: "Un artículo por idioma. Se muestra solo en /es o /en según este valor.",
          options: [
            { label: "Español", value: "es" },
            { label: "English", value: "en" },
          ],
          defaultValue: "es",
        }),
        date: fields.date({
          label: "Fecha de publicación",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        updated: fields.date({
          label: "Última actualización",
          description:
            "Opcional. Si editas el artículo de forma relevante, pon aquí la fecha: se usa en el sitemap y en los buscadores.",
        }),
        excerpt: fields.text({
          label: "Resumen",
          description: `Máximo ${EXCERPT_MAX} caracteres. Se usa como meta description en Google.`,
          multiline: true,
          validation: { isRequired: true, length: { max: EXCERPT_MAX } },
        }),
        cover: fields.image({
          label: "Imagen de portada",
          description: "Mejor 1200x630. Se usa también al compartir en redes.",
          directory: "public/images/news",
          publicPath: "/images/news/",
          validation: { isRequired: true },
        }),
        coverAlt: fields.text({
          label: "Texto alternativo de la portada",
          description: "Describe la imagen para personas que no la ven.",
          validation: { isRequired: true, length: { max: 200 } },
        }),
        translationSlug: fields.relationship({
          label: "Traducción (translationSlug)",
          description: "Opcional. El mismo artículo en el otro idioma, para enlazar las versiones.",
          collection: "news",
        }),
        content: fields.mdx({ label: "Cuerpo" }),
      },
    }),
  },
});
