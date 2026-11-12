import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { readNewsFiles } from "./support/news-content";

const PUBLIC_ROUTES = ["", "/team", "/coaching", "/news", "/store", "/about-us", "/tryouts"];
const LOCALES = ["es", "en"] as const;

const switcherLinks = (page: Page) =>
  page.locator(".navbar .locale-switcher a").evaluateAll((links) =>
    links.map((link) => ({
      lang: link.getAttribute("hreflang") ?? "",
      href: link.getAttribute("href") ?? "",
    })),
  );

async function expectAllReachable(request: APIRequestContext, hrefs: string[]) {
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
}

for (const locale of LOCALES) {
  for (const route of PUBLIC_ROUTES) {
    const path = `/${locale}${route}`;

    test(`the language switcher of ${path} never links to a missing page`, async ({
      page,
      request,
    }) => {
      await page.goto(path);
      const links = await switcherLinks(page);

      expect(links.map(({ lang }) => lang)).toEqual([...LOCALES]);
      await expectAllReachable(
        request,
        links.map(({ href }) => href),
      );
    });
  }
}

test("on a missing page the language switcher goes to each home", async ({ page, request }) => {
  await page.goto("/en/news/this-article-does-not-exist");

  const links = await switcherLinks(page);
  expect(links).toEqual([
    { lang: "es", href: "/es" },
    { lang: "en", href: "/en" },
  ]);
  await expectAllReachable(
    request,
    links.map(({ href }) => href),
  );
});

test.describe("language switcher on news articles", () => {
  const articles = readNewsFiles();
  test.skip(articles.length === 0, "Sin artículos en content/news (por ejemplo en CI)");

  const translationOf = (article: (typeof articles)[number]) =>
    articles.find(
      (other) =>
        other.locale !== article.locale &&
        (article.translationSlug === other.slug || other.translationSlug === article.slug),
    );

  for (const article of articles) {
    const other = LOCALES.find((code) => code !== article.locale)!;
    const translation = translationOf(article);

    test(`${article.locale}/${article.slug} switches to ${translation ? "its translation" : "the news list"}`, async ({
      page,
    }) => {
      await page.goto(`/${article.locale}/news/${article.slug}`);

      const expected = translation ? `/${other}/news/${translation.slug}` : `/${other}/news`;
      const link = page.locator(`.navbar .locale-switcher a[hreflang="${other}"]`);
      await expect(link).toHaveAttribute("href", expected);
      await expect(
        page.locator(`.navbar .locale-switcher a[hreflang="${article.locale}"]`),
      ).toHaveAttribute("href", `/${article.locale}/news/${article.slug}`);

      const response = await Promise.all([page.waitForURL(`**${expected}`), link.click()]).then(
        () => page.request.get(expected),
      );
      expect(response.status()).toBe(200);
      if (translation) await expect(page.locator("h1")).toHaveText(translation.title);
    });
  }
});
