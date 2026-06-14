// src/i18n/navigation.ts
// Exporta Link, redirect, usePathname, etc. con el locale aplicado automáticamente

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
