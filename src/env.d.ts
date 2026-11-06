/// <reference path="../.astro/types.d.ts" />

/** ISO 8601 del build, inyectado por Vite (astro.config.ts). */
declare const __BUILD_DATE__: string;

declare namespace App {
  interface Locals {
    locale: import("@/ui/i18n").Locale;
    /** Solo en /admin/*: sesión verificada en el servidor y acceso a la autenticación. */
    adminEmail?: string;
    adminAuth?: import("@/domain/admin/admin-auth").AdminAuth;
    underConstruction?: import("@config/pages").PageKey;
  }
}
