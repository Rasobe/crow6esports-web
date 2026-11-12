/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    locale: import("@/ui/i18n").Locale;
    /** Solo en /admin/*: sesión verificada en el servidor y acceso a la autenticación. */
    adminEmail?: string;
    adminAuth?: import("@/domain/admin/admin-auth").AdminAuth;
    underConstruction?: import("@config/pages").PageKey;
  }
}
