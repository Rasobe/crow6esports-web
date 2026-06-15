export const navigationConfig = {
  mainNav: [
    { href: "/team", labelKey: "team" },
    { href: "/news", labelKey: "news" },
    { href: "/store", labelKey: "store" },
    { href: "/coaching", labelKey: "coaching" },
    { href: "/about-us", labelKey: "about-us" },
  ] as const,
} as const;

export type NavigationConfig = typeof navigationConfig;
