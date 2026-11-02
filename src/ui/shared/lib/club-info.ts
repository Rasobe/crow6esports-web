import { CLUB } from "@config/club";
import { yearsSince } from "@/domain/site/years";
import type { Locale } from "@/ui/i18n";

export function getLocationLabel(locale: Locale): string {
  const { city, countryCode } = CLUB.location;
  const country = new Intl.DisplayNames(locale, { type: "region" }).of(countryCode) ?? countryCode;
  return `${city}, ${country}`;
}

export function getClubYears(): number {
  return yearsSince(CLUB.foundedYear);
}
