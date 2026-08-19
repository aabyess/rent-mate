-- supabase/migrations/20260819155112_blocks.sql
-- 차단(블록) 기능: 차단하면 파트너 목록·상세, 채팅 목록에서 상대를 숨긴다.
-- 신고 기능과 함께 기술적 안전조치 요건을 구성한다.

create table public.blocks (
	id uuid primary key default gen_random_uuid(),
	blocker_id uuid not null references public.profiles (id) on delete cascade,
	blocked_id uuid not null references public.profiles (id) on delete cascade,
	created_at timestamptz not null default now(),
	unique (blocker_id, blocked_id),
	check (blocker_id <> blocked_id)
);

alter table public.blocks enable row level security;

-- blocks: 본인 차단만 조회·생성·해제. admin은 모니터링용 조회.
create policy "blocks_select_own_or_admin" on public.blocks
	for select using (blocker_id = auth.uid() or public.is_admin());
create policy "blocks_insert_own" on public.blocks
	for insert with check (blocker_id = auth.uid());
create policy "blocks_delete_own" on public.blocks
	for delete using (blocker_id = auth.uid());
