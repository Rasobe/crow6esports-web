import type { SupabaseClient } from "@supabase/supabase-js";
import type { SubmissionLocale, TryoutApplication } from "@/domain/tryouts/tryout-application";
import type { TryoutRepository } from "@/domain/tryouts/tryout-repository";

const TRYOUT_REQUESTS_TABLE = "tryout_requests";

const emptyToNull = (value: string | undefined) => (value ? value : null);

function toRow(application: TryoutApplication, locale: SubmissionLocale) {
  return {
    locale,
    discord: application.discord,
    birth_date: application.birthDate,
    country: application.country,
    available_days: application.availableDays,
    schedule_type: application.scheduleType,
    schedule_from: emptyToNull(application.scheduleFrom),
    schedule_to: emptyToNull(application.scheduleTo),
    availability_notes: emptyToNull(application.availabilityNotes),
    time_zone: emptyToNull(application.timeZone),
    rltracker: application.rltracker,
    rank: application.rank,
    peak: application.peak,
    hours_played: application.hoursPlayed,
    playstyle: application.playstyle,
    highlights: emptyToNull(application.highlights),
    has_competitive_exp: application.hasCompetitiveExp,
    previous_teams: emptyToNull(application.previousTeams),
    reaction_to_mistakes: application.reactionToMistakes,
    reaction_to_losses: application.reactionToLosses,
    looking_for: application.lookingFor,
    open_to_coaching: application.openToCoaching,
  };
}

export function createSupabaseTryoutRepository(client: SupabaseClient): TryoutRepository {
  return {
    async save(application, locale) {
      const { error } = await client.from(TRYOUT_REQUESTS_TABLE).insert(toRow(application, locale));

      if (error) throw new Error(`Supabase rejected the tryout request: ${error.message}`);
    },
  };
}
