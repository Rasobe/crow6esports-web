export const ATTRIBUTION_MAX = { page: 200, referrer: 500, utm: 100 } as const;

/** Where a request came from. Only public, non personal data: never an IP or an identifier. */
export interface Attribution {
  /** Path of the first page the visitor saw in the session, without query or hash. */
  sourcePage?: string;
  /** Origin and path of the page that linked to the site, without query or hash. */
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}
