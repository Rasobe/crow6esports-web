/// <reference path="../.astro/types.d.ts" />

/** ISO 8601 del build, inyectado por Vite (astro.config.ts). */
declare const __BUILD_DATE__: string;

declare namespace App {
  interface Locals {
    locale: import("@/ui/i18n").Locale;
    underConstruction?: import("@config/pages").PageKey;
  }
}
