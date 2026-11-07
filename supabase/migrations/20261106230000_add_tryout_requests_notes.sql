-- Internal notes written by admins from the /admin panel. Never filled by applicants.
alter table public.tryout_requests
  add column notes text check (char_length(notes) <= 4000);
