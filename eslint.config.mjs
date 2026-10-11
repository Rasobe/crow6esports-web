import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([".astro/**", ".vercel/**", "dist/**"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    files: ["src/env.d.ts"],
    rules: { "@typescript-eslint/triple-slash-reference": "off" },
  },
]);
