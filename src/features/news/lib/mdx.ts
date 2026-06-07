import fs from "fs";
import path from "path";
import type { Article, ArticleFrontmatter } from "../types";

const CONTENT_DIR = path.join(process.cwd(), "content/news");

function parseFrontmatter(raw: string): { frontmatter: ArticleFrontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid MDX frontmatter");

  const fmLines = match[1].split("\n");
  const frontmatter: Record<string, unknown> = {};

  for (const line of fmLines) {
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (value.startsWith("[")) {
      frontmatter[key.trim()] = value
        .replace(/[\[\]"]/g, "")
        .split(",")
        .map((s) => s.trim());
    } else {
      frontmatter[key.trim()] = value.replace(/^"|"$/g, "");
    }
  }

  return { frontmatter: frontmatter as ArticleFrontmatter, body: match[2] };
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200);
}

export async function getAllArticles(): Promise<Article[]> {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { frontmatter, body } = parseFrontmatter(raw);
    return { ...frontmatter, readingTime: estimateReadingTime(body) };
  });
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getAllArticles();
  return articles.find((a) => a.slug === slug);
}
