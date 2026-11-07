import { REQUEST_STATUSES, type RequestStatus } from "@/domain/tryouts/tryout-application";

export interface ListQuery {
  status?: RequestStatus;
  page: number;
}

const isStatus = (value: string | null): value is RequestStatus =>
  REQUEST_STATUSES.some((status) => status === value);

/** Anything unexpected in the URL falls back to the first page without filter. */
export function parseListQuery(params: URLSearchParams): ListQuery {
  const status = params.get("status");
  const page = Number(params.get("page"));

  return {
    status: isStatus(status) ? status : undefined,
    page: Number.isInteger(page) && page >= 1 ? page : 1,
  };
}

export function listHref(basePath: string, { status, page }: Partial<ListQuery>): string {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
