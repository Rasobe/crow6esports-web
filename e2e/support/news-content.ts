import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const NEWS_DIR = join(process.cwd(), "content", "news");

export interface NewsFile {
  slug: string;
  locale: string;
  translationSlug?: string;
  title: string;
}

const field = (source: string, name: string) =>
  new RegExp(`^${name}:\\s*(.+)$`, "m")
    .exec(source)?.[1]
    ?.trim()
    .replace(/^["']|["']$/g, "");

/** Los artículos que hay en el contenido. Con borradores locales hay; en CI no hay ninguno. */
export function readNewsFiles(): NewsFile[] {
  if (!existsSync(NEWS_DIR)) return [];

  return readdirSync(NEWS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const source = readFileSync(join(NEWS_DIR, file), "utf8");
      return {
        slug: file.replace(/\.mdx$/, ""),
        locale: field(source, "locale") ?? "es",
        translationSlug: field(source, "translationSlug"),
        title: field(source, "title") ?? "",
      };
    });
}

export const hasNews = (locale?: string) =>
  readNewsFiles().some((article) => !locale || article.locale === locale);
