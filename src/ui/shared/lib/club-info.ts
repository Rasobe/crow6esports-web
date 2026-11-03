import { CLUB } from "@config/club";
import { yearsSince } from "@/domain/site/years";

export function getClubYears(): number {
  return yearsSince(CLUB.foundedYear);
}
