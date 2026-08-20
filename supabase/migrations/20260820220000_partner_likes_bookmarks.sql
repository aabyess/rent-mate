-- supabase/migrations/20260820220000_partner_likes_bookmarks.sql
-- 파트너 좋아요(공개 호감 — 개수만 공개, 누른 사람은 비공개)와
-- 찜(비공개 보관 목록 — 마이페이지 '찜한 파트너'에서 다시 보기).

create table public.partner_likes (
	customer_id uuid not null references public.profiles (id) on delete cascade,
	partner_id uuid not null references public.partner_profiles (profile_id) on delete cascade,
	created_at timestamptz not null default now(),
	primary key (customer_id, partner_id),
	check (customer_id <> partner_id)
);

create table public.partner_bookmarks (
	customer_id uuid not null references public.profiles (id) on delete cascade,
	partner_id uuid not null references public.partner_profiles (profile_id) on delete cascade,
	created_at timestamptz not null default now(),
	primary key (customer_id, partner_id),
	check (customer_id <> partner_id)
);

create index partner_likes_partner_idx on public.partner_likes (partner_id);

alter table public.partner_likes enable row level security;
alter table public.partner_bookmarks enable row level security;

-- 행 자체는 본인 것만 — 다른 사람이 누굴 좋아요/찜했는지는 볼 수 없다
create policy "partner_likes_select_own" on public.partner_likes
	for select using (customer_id = auth.uid());
create policy "partner_likes_insert_own" on public.partner_likes
	for insert with check (customer_id = auth.uid());
create policy "partner_likes_delete_own" on public.partner_likes
	for delete using (customer_id = auth.uid());

create policy "partner_bookmarks_select_own" on public.partner_bookmarks
	for select using (customer_id = auth.uid());
create policy "partner_bookmarks_insert_own" on public.partner_bookmarks
	for insert with check (customer_id = auth.uid());
create policy "partner_bookmarks_delete_own" on public.partner_bookmarks
	for delete using (customer_id = auth.uid());

-- 좋아요 개수만 공개하는 집계 함수 (행 노출 없이) — 파트너 상세·파트너 홈 지표용
create function public.get_partner_like_counts(p_partner_ids uuid[])
returns table (partner_id uuid, like_count bigint)
language sql stable security definer
set search_path = public
as $$
	select pl.partner_id, count(*)::bigint
	from public.partner_likes pl
	where pl.partner_id = any (p_partner_ids)
	group by pl.partner_id;
$$;

revoke execute on function public.get_partner_like_counts(uuid[]) from public, anon;
grant execute on function public.get_partner_like_counts(uuid[]) to authenticated;
