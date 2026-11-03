import type { AnnouncementDefinition } from "@/application/site/get-announcements";

export const ANNOUNCEMENTS: readonly AnnouncementDefinition[] = [
  { key: "roster" },
  { key: "coaching" },
  { key: "tryouts", requires: "tryoutsOpen" },
];
