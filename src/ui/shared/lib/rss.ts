export interface FeedItem {
  title: string;
  /** El extracto del artículo: lo que se lee en el lector de feeds y en Discord. */
  description: string;
  /** URL absoluta del artículo. */
  url: string;
  published: Date;
  /** URL absoluta de la portada, si la hay. */
  image?: string;
}

interface FeedInput {
  title: string;
  description: string;
  /** URL absoluta de la portada del sitio en ese idioma. */
  siteUrl: string;
  /** URL absoluta del propio feed, que RSS pide declarar. */
  feedUrl: string;
  language: string;
  items: readonly FeedItem[];
}

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS pide fechas en RFC 822, no en ISO. */
const formatDate = (date: Date) => date.toUTCString();

/**
 * Feed RSS 2.0 de las noticias de un idioma, del más reciente al más antiguo.
 *
 * Un feed por idioma y no uno conjunto: cada artículo tiene su traducción, y mezclarlos
 * publicaría la misma noticia dos veces en los lectores y en Discord.
 */
export function buildRssFeed({
  title,
  description,
  siteUrl,
  feedUrl,
  language,
  items,
}: FeedInput): string {
  const entries = [...items]
    .sort((a, b) => b.published.getTime() - a.published.getTime())
    .map((item) => {
      const url = escapeXml(item.url);
      // La portada va como enclosure: es como la leen los lectores de feeds y los bots.
      const enclosure = item.image
        ? `\n      <enclosure url="${escapeXml(item.image)}" type="image/jpeg"/>`
        : "";

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${formatDate(item.published)}</pubDate>${enclosure}
    </item>`;
    })
    .join("\n");

  const newest = items.reduce<Date | undefined>(
    (latest, item) => (!latest || item.published > latest ? item.published : latest),
    undefined,
  );
  const lastBuild = newest ? `\n    <lastBuildDate>${formatDate(newest)}</lastBuildDate>` : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>${escapeXml(language)}</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>${lastBuild}
${entries}
  </channel>
</rss>
`;
}
