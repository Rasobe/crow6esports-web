import { defineConfig, envField, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import type { ViteUserConfig } from "astro";

const ROLLDOWN_STUB_ID = "\0build-only:rolldown";

/**
 * @astrojs/vercel imports `rolldown` (a native, build time bundler) from the module that
 * its serverless entrypoint also uses. Vercel does not ship the native binding with the
 * function, so the import crashes every request with a 500. The code that needs it only
 * runs at build time, so the server bundle gets a stub instead.
 */
type VitePlugin = Extract<NonNullable<ViteUserConfig["plugins"]>[number], { name: string }>;

const stubBuildOnlyRolldown: VitePlugin = {
  name: "stub-build-only-rolldown",
  apply: "build",
  enforce: "pre",
  resolveId(id) {
    if (id === "rolldown" && this.environment?.name === "ssr") return ROLLDOWN_STUB_ID;
  },
  load(id) {
    if (id === ROLLDOWN_STUB_ID) {
      return "export const rolldown = () => { throw new Error('rolldown is only available at build time'); };";
    }
  },
};

export default defineConfig({
  site: process.env.SITE_URL ?? "https://crow6esports.com",
  output: "server",
  adapter: vercel({ webAnalytics: { enabled: true } }),
  integrations: [mdx(), react()],
  env: {
    schema: {
      MAINTENANCE_MODE: envField.boolean({ context: "server", access: "secret", default: false }),
      TRYOUTS_OPEN: envField.boolean({ context: "server", access: "secret", default: false }),
      RESEND_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      TRYOUT_EMAIL_FROM: envField.string({
        context: "server",
        access: "secret",
        default: "noreply@crow6esports.com",
      }),
      TRYOUT_EMAIL_TO: envField.string({
        context: "server",
        access: "secret",
        default: "crow6esports@gmail.com",
      }),
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
    plugins: [stubBuildOnlyRolldown],
    css: {
      preprocessorOptions: {
        scss: { loadPaths: ["src"], silenceDeprecations: ["import"] },
      },
    },
  },
});
