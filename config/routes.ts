export const ROUTES = {
  home: "/",
  team: "/team",
  news: "/news",
  coaching: "/coaching",
  store: "/store",
  aboutUs: "/about-us",
  tryouts: "/tryouts",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
