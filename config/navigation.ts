import { ROUTES } from "./routes";

export const navigationConfig = {
  mainNav: [
    { href: ROUTES.team, labelKey: "team" },
    { href: ROUTES.news, labelKey: "news" },
    { href: ROUTES.coaching, labelKey: "coaching" },
    { href: ROUTES.store, labelKey: "store" },
    { href: ROUTES.aboutUs, labelKey: "about_us" },
  ],
} as const;

export type NavigationConfig = typeof navigationConfig;
