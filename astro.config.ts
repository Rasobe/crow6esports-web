import { defineConfig, envField, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://crow6esports.com",
  output: "server",
  adapter: vercel({ webAnalytics: { enabled: true } }),
  integrations: [mdx()],
  env: {
    schema: {
      MAINTENANCE_MODE: envField.boolean({ context: "server", access: "secret", default: false }),
      SITE_URL: envField.string({
        context: "server",
        access: "public",
        default: "https://crow6esports.com",
      }),
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Anton SC",
      cssVariable: "--font-display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.google(),
      name: "Barlow Condensed",
      cssVariable: "--font-ui",
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
    },
    {
      provider: fontProviders.google(),
      name: "Barlow",
      cssVariable: "--font-body",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
    },
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: { loadPaths: ["src"], silenceDeprecations: ["import"] },
      },
    },
  },
});
