import { describe, expect, it } from "vitest";
import { buildRssFeed } from "./rss";

const feed = (items: Parameters<typeof buildRssFeed>[0]["items"]) =>
  buildRssFeed({
    title: "Crow 6 eSports · Noticias",
    description: "Las últimas noticias del club.",
    siteUrl: "https://crow6esports.com/es/news",
    feedUrl: "https://crow6esports.com/rss.xml",
    language: "es",
    items,
  });

const article = (title: string, published: Date) => ({
  title,
  description: "Un extracto.",
  url: `https://crow6esports.com/es/news/${title.toLowerCase()}`,
  published,
  image: "https://crow6esports.com/images/news/x/cover.jpg",
});

describe("buildRssFeed", () => {
  it("declares itself so readers can subscribe", () => {
    expect(feed([])).toContain(
      '<atom:link href="https://crow6esports.com/rss.xml" rel="self" type="application/rss+xml"/>',
    );
  });

  it("puts the newest article first, whatever order it was given", () => {
    const xml = feed([
      article("vieja", new Date("2026-11-01")),
      article("nueva", new Date("2026-11-20")),
    ]);

    expect(xml.indexOf("nueva")).toBeLessThan(xml.indexOf("vieja"));
  });

  it("dates items in RFC 822, which is what RSS asks for", () => {
    expect(feed([article("una", new Date("2026-11-20T00:00:00Z"))])).toContain(
      "<pubDate>Fri, 20 Nov 2026 00:00:00 GMT</pubDate>",
    );
  });

  it("escapes the characters that would break the XML", () => {
    const xml = feed([{ ...article("una", new Date()), title: 'Crow 6 & "Kami-1" <b>' }]);

    expect(xml).toContain("Crow 6 &amp; &quot;Kami-1&quot; &lt;b&gt;");
    expect(xml).not.toContain("<b>");
  });

  it("carries the cover so feed readers and bots can show it", () => {
    expect(feed([article("una", new Date())])).toContain(
      '<enclosure url="https://crow6esports.com/images/news/x/cover.jpg" type="image/jpeg"/>',
    );
  });

  it("leaves the enclosure out when an article has no cover", () => {
    const withoutCover = { ...article("una", new Date()), image: undefined };

    expect(feed([withoutCover])).not.toContain("<enclosure");
  });
});
