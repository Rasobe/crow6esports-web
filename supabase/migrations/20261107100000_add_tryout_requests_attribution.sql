-- Cookieless attribution: where the visitor came from. No IP and no personal identifiers.
alter table public.tryout_requests
  add column source_page text check (char_length(source_page) <= 200),
  add column referrer text check (char_length(referrer) <= 500),
  add column utm_source text check (char_length(utm_source) <= 100),
  add column utm_medium text check (char_length(utm_medium) <= 100),
  add column utm_campaign text check (char_length(utm_campaign) <= 100);

create index tryout_requests_created_at_idx on public.tryout_requests (created_at desc);
