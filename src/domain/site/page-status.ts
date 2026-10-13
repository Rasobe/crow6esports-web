export type PageStatus = "live" | "soon";

export interface PageDefinition<Key extends string = string> {
  key: Key;
  route: string;
  status: PageStatus;
}

function matchesRoute(route: string, path: string): boolean {
  if (route === "/") return path === "/";
  return path === route || path.startsWith(`${route}/`);
}

export function findPage<Key extends string>(
  pages: readonly PageDefinition<Key>[],
  path: string,
): PageDefinition<Key> | undefined {
  return pages
    .filter((page) => matchesRoute(page.route, path))
    .sort((a, b) => b.route.length - a.route.length)[0];
}

export function isLive(page: PageDefinition): boolean {
  return page.status === "live";
}
