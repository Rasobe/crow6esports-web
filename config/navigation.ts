export const navigationConfig = {
  mainNav: [
    { href: "/team", labelKey: "team" },
    { href: "/news", labelKey: "news" },
    { href: "/coaching", labelKey: "coaching" },
    { href: "/store", labelKey: "store" },
    { href: "/about-us", labelKey: "about_us" },
  ] as const,
} as const;

export type NavigationConfig = typeof navigationConfig;
