-- Tryout applications submitted from POST /api/contact.
-- Only the server writes here, using the service role key (it bypasses RLS).

create table public.tryout_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'accepted', 'rejected')),
  locale text not null check (locale in ('es', 'en')),

  discord text not null,
  birth_date date not null,
  country text not null,
  available_days text[] not null
    check (
      cardinality(available_days) between 1 and 7
      and available_days <@ array['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    ),
  schedule_type text not null check (schedule_type in ('fixed', 'flexible')),
  schedule_from text check (schedule_from ~ '^([01][0-9]|2[0-3]):[03]0$'),
  schedule_to text check (schedule_to ~ '^([01][0-9]|2[0-3]):[03]0$'),
  availability_notes text,
  time_zone text,
  rltracker text not null,
  rank text not null,
  peak text not null,
  hours_played integer not null check (hours_played between 1 and 100000),
  playstyle text not null check (playstyle in ('calm', 'intermediate', 'mechanical', 'aggressive')),
  highlights text,
  has_competitive_exp text not null check (has_competitive_exp in ('yes', 'no')),
  previous_teams text,
  reaction_to_mistakes text not null,
  reaction_to_losses text not null check (reaction_to_losses in ('encourage', 'down', 'calm')),
  looking_for text not null,
  open_to_coaching text not null check (open_to_coaching in ('yes', 'no', 'maybe'))
);

create index tryout_requests_status_created_at_idx
  on public.tryout_requests (status, created_at desc);

-- RLS on and no policies: anon and authenticated roles can neither read nor write.
alter table public.tryout_requests enable row level security;
revoke all on public.tryout_requests from anon, authenticated;
