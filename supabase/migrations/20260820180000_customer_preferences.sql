-- supabase/migrations/20260820180000_customer_preferences.sql
-- 고객 취향(관심사·선호 지역·데이트 목적) — 가입 직후 위저드에서 입력하거나
-- 건너뛸 수 있고(skipped_at 기록 시 위저드 재노출 안 함), 마이페이지에서 수정한다.
-- 홈 덱은 이 취향과 겹치는 파트너를 앞쪽에 배치하는 데 쓴다.

create table public.customer_preferences (
	profile_id uuid primary key references public.profiles (id) on delete cascade,
	interests text[] not null default '{}',
	regions text[] not null default '{}',
	purposes text[] not null default '{}',
	skipped_at timestamptz,
	updated_at timestamptz not null default now()
);

alter table public.customer_preferences enable row level security;

create policy "customer_preferences_select_own" on public.customer_preferences
	for select using (profile_id = auth.uid());
create policy "customer_preferences_insert_own" on public.customer_preferences
	for insert with check (profile_id = auth.uid());
create policy "customer_preferences_update_own" on public.customer_preferences
	for update using (profile_id = auth.uid());
