import { getCollection, render } from "astro:content";

export async function renderArticleContent(slug: string) {
  const entries = await getCollection("news");
  const entry = entries.find(({ data }) => data.slug === slug);

  return entry ? render(entry) : undefined;
}
