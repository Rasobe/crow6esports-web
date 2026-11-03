import { describe, expect, it } from "vitest";
import { getAnnouncementKeys, type AnnouncementDefinition } from "./get-announcements";

const definitions: AnnouncementDefinition[] = [
  { key: "roster" },
  { key: "tryouts", requires: "tryoutsOpen" },
];

describe("getAnnouncementKeys", () => {
  it("keeps conditional announcements when their flag is on", () => {
    expect(getAnnouncementKeys(definitions, { tryoutsOpen: true })).toEqual(["roster", "tryouts"]);
  });

  it("drops conditional announcements when their flag is off", () => {
    expect(getAnnouncementKeys(definitions, { tryoutsOpen: false })).toEqual(["roster"]);
  });
});
