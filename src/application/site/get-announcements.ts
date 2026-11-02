export interface AnnouncementFlags {
  tryoutsOpen: boolean;
}

export interface AnnouncementDefinition {
  key: string;
  requires?: keyof AnnouncementFlags;
}

export function getAnnouncementKeys(
  definitions: readonly AnnouncementDefinition[],
  flags: AnnouncementFlags,
): string[] {
  return definitions
    .filter(({ requires }) => requires === undefined || flags[requires])
    .map(({ key }) => key);
}
