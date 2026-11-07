import type { SupabaseClient } from "@supabase/supabase-js";
import { pageRange } from "@/domain/admin/pagination";
import type {
  CoachingOpenness,
  CompetitiveExperience,
  LossReaction,
  Playstyle,
  RequestStatus,
  ScheduleType,
  SubmissionLocale,
  Weekday,
} from "@/domain/tryouts/tryout-application";
import type { AttributionSample, TryoutRequest } from "@/domain/tryouts/tryout-request";
import type { TryoutRequestRepository } from "@/domain/tryouts/tryout-request.repository";

const TRYOUT_REQUESTS_TABLE = "tryout_requests";
const ATTRIBUTION_PAGE_SIZE = 1000;
const ATTRIBUTION_ROW_LIMIT = 20_000;

export interface TryoutRequestRow {
  id: string;
  created_at: string;
  status: RequestStatus;
  locale: SubmissionLocale;
  notes: string | null;
  source_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  discord: string;
  birth_date: string;
  country: string;
  available_days: Weekday[];
  schedule_type: ScheduleType;
  schedule_from: string | null;
  schedule_to: string | null;
  availability_notes: string | null;
  time_zone: string | null;
  rltracker: string;
  rank: string;
  peak: string;
  hours_played: number;
  playstyle: Playstyle;
  highlights: string | null;
  has_competitive_exp: CompetitiveExperience;
  previous_teams: string | null;
  reaction_to_mistakes: string;
  reaction_to_losses: LossReaction;
  looking_for: string;
  open_to_coaching: CoachingOpenness;
}

const nullToUndefined = <T>(value: T | null): T | undefined => value ?? undefined;

export function toTryoutRequest(row: TryoutRequestRow): TryoutRequest {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    locale: row.locale,
    notes: row.notes,
    sourcePage: nullToUndefined(row.source_page),
    referrer: nullToUndefined(row.referrer),
    utmSource: nullToUndefined(row.utm_source),
    utmMedium: nullToUndefined(row.utm_medium),
    utmCampaign: nullToUndefined(row.utm_campaign),
    discord: row.discord,
    birthDate: row.birth_date,
    country: row.country,
    availableDays: row.available_days,
    scheduleType: row.schedule_type,
    scheduleFrom: nullToUndefined(row.schedule_from),
    scheduleTo: nullToUndefined(row.schedule_to),
    availabilityNotes: nullToUndefined(row.availability_notes),
    timeZone: nullToUndefined(row.time_zone),
    rltracker: row.rltracker,
    rank: row.rank,
    peak: row.peak,
    hoursPlayed: row.hours_played,
    playstyle: row.playstyle,
    highlights: nullToUndefined(row.highlights),
    hasCompetitiveExp: row.has_competitive_exp,
    previousTeams: nullToUndefined(row.previous_teams),
    reactionToMistakes: row.reaction_to_mistakes,
    reactionToLosses: row.reaction_to_losses,
    lookingFor: row.looking_for,
    openToCoaching: row.open_to_coaching,
  };
}

export function createSupabaseTryoutRequestRepository(
  client: SupabaseClient,
): TryoutRequestRepository {
  return {
    async list({ status, page, pageSize }) {
      const { from, to } = pageRange(page, pageSize);
      let query = client
        .from(TRYOUT_REQUESTS_TABLE)
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
      if (status) query = query.eq("status", status);

      const { data, count, error } = await query;
      if (error) throw new Error(`Could not list tryout requests: ${error.message}`);

      return {
        items: (data as TryoutRequestRow[]).map(toTryoutRequest),
        total: count ?? 0,
        page,
        pageSize,
      };
    },

    async findById(id) {
      const { data, error } = await client
        .from(TRYOUT_REQUESTS_TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(`Could not read the tryout request: ${error.message}`);

      return data ? toTryoutRequest(data as TryoutRequestRow) : null;
    },

    async listAttribution(since) {
      const samples: AttributionSample[] = [];

      // PostgREST caps every response, so the rows are read in pages
      for (let from = 0; from < ATTRIBUTION_ROW_LIMIT; from += ATTRIBUTION_PAGE_SIZE) {
        const { data, error } = await client
          .from(TRYOUT_REQUESTS_TABLE)
          .select("source_page, utm_source")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: false })
          .range(from, from + ATTRIBUTION_PAGE_SIZE - 1);
        if (error) throw new Error(`Could not read the attribution: ${error.message}`);

        const rows = data as Pick<TryoutRequestRow, "source_page" | "utm_source">[];
        samples.push(
          ...rows.map((row) => ({ sourcePage: row.source_page, utmSource: row.utm_source })),
        );
        if (rows.length < ATTRIBUTION_PAGE_SIZE) break;
      }

      return samples;
    },

    async updateReview(id, { status, notes }) {
      const { data, error } = await client
        .from(TRYOUT_REQUESTS_TABLE)
        .update({ status, notes })
        .eq("id", id)
        .select("id");
      if (error) throw new Error(`Could not update the tryout request: ${error.message}`);

      return data.length > 0;
    },
  };
}
