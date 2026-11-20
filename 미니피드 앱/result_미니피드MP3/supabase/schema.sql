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

-- ============================================================
-- MP3: 좋아요 · 댓글 · 신고
-- ============================================================

-- 좋아요: 한 사람이 한 글에 한 번만 (복합 기본키로 중복 방지)
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists post_likes_post_id_idx
  on public.post_likes (post_id);

alter table public.post_likes enable row level security;

drop policy if exists "anonymous users can read likes" on public.post_likes;
create policy "anonymous users can read likes"
on public.post_likes
for select
to authenticated
using ((select (auth.jwt() ->> 'is_anonymous')::boolean) is true);

drop policy if exists "anonymous users can create likes" on public.post_likes;
create policy "anonymous users can create likes"
on public.post_likes
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (select (auth.jwt() ->> 'is_anonymous')::boolean) is true
);

drop policy if exists "anonymous users can delete own likes" on public.post_likes;
create policy "anonymous users can delete own likes"
on public.post_likes
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- 댓글
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_id_created_at_idx
  on public.comments (post_id, created_at asc);

alter table public.comments enable row level security;

drop policy if exists "anonymous users can read comments" on public.comments;
create policy "anonymous users can read comments"
on public.comments
for select
to authenticated
using ((select (auth.jwt() ->> 'is_anonymous')::boolean) is true);

drop policy if exists "anonymous users can create comments" on public.comments;
create policy "anonymous users can create comments"
on public.comments
for insert
to authenticated
with check (
  (select auth.uid()) = author_id
  and (select (auth.jwt() ->> 'is_anonymous')::boolean) is true
);

-- 신고: 앱은 insert 만 가능 (select 정책 없음 → 신고 내역은 앱에서 조회 불가)
create table if not exists public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('spam', 'abuse', 'sexual', 'illegal', 'other')),
  detail text check (char_length(detail) <= 300),
  created_at timestamptz not null default now()
);

create index if not exists post_reports_created_at_idx
  on public.post_reports (created_at desc);

alter table public.post_reports enable row level security;

drop policy if exists "anonymous users can create reports" on public.post_reports;
create policy "anonymous users can create reports"
on public.post_reports
for insert
to authenticated
with check (
  (select auth.uid()) = reporter_id
  and (select (auth.jwt() ->> 'is_anonymous')::boolean) is true
);
