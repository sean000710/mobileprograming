create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

alter table public.posts enable row level security;

drop policy if exists "anonymous users can read posts" on public.posts;
create policy "anonymous users can read posts"
on public.posts
for select
to authenticated
using ((select (auth.jwt() ->> 'is_anonymous')::boolean) is true);

drop policy if exists "anonymous users can create posts" on public.posts;
create policy "anonymous users can create posts"
on public.posts
for insert
to authenticated
with check (
  (select auth.uid()) = author_id
  and (select (auth.jwt() ->> 'is_anonymous')::boolean) is true
);

