-- supabase/migrations/20260819000000_init.sql
-- RentMate 초기 스키마: 프로필, 파트너, 예약, 채팅(로그 보관), 후기, 신고
-- 법적 제약 반영:
--   - chat_messages는 update/delete 정책 없음 → 대화 저장 의무 (청소년보호법 기술적 안전조치)
--   - reports는 신고 기능 요구사항
--   - profiles.adult_verified_at / phone_verified_at은 성인인증·실명인증 게이트용

-- ── enums ────────────────────────────────────────────────────────────────────

create type public.user_role as enum ('customer', 'partner', 'admin');
create type public.booking_status as enum ('requested', 'accepted', 'rejected', 'canceled', 'completed');
create type public.report_status as enum ('open', 'resolved', 'dismissed');

-- ── tables ───────────────────────────────────────────────────────────────────

create table public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	role public.user_role not null default 'customer',
	name text not null,
	phone text,
	phone_verified_at timestamptz,
	adult_verified_at timestamptz,
	created_at timestamptz not null default now()
);

create table public.partner_profiles (
	profile_id uuid primary key references public.profiles (id) on delete cascade,
	nickname text not null,
	bio text not null default '',
	hourly_rate_krw integer not null check (hourly_rate_krw > 0),
	photo_urls text[] not null default '{}',
	is_approved boolean not null default false,
	is_active boolean not null default true,
	created_at timestamptz not null default now()
);

create table public.bookings (
	id uuid primary key default gen_random_uuid(),
	customer_id uuid not null references public.profiles (id),
	partner_id uuid not null references public.profiles (id),
	starts_at timestamptz not null,
	ends_at timestamptz not null,
	place text not null,
	status public.booking_status not null default 'requested',
	total_amount_krw integer not null check (total_amount_krw >= 0),
	created_at timestamptz not null default now(),
	check (ends_at > starts_at),
	check (customer_id <> partner_id)
);

-- 대화 저장 의무 대상: on delete restrict + update/delete RLS 정책 없음
create table public.chat_messages (
	id uuid primary key default gen_random_uuid(),
	booking_id uuid not null references public.bookings (id) on delete restrict,
	sender_id uuid not null references public.profiles (id),
	content text not null check (length(content) between 1 and 2000),
	created_at timestamptz not null default now()
);

create table public.reviews (
	id uuid primary key default gen_random_uuid(),
	booking_id uuid not null unique references public.bookings (id),
	author_id uuid not null references public.profiles (id),
	rating smallint not null check (rating between 1 and 5),
	content text not null default '',
	created_at timestamptz not null default now()
);

create table public.reports (
	id uuid primary key default gen_random_uuid(),
	reporter_id uuid not null references public.profiles (id),
	target_id uuid not null references public.profiles (id),
	booking_id uuid references public.bookings (id),
	reason text not null,
	status public.report_status not null default 'open',
	created_at timestamptz not null default now()
);

create index bookings_customer_id_idx on public.bookings (customer_id);
create index bookings_partner_id_idx on public.bookings (partner_id);
create index chat_messages_booking_id_idx on public.chat_messages (booking_id, created_at);
create index reports_status_idx on public.reports (status);

-- ── helpers ──────────────────────────────────────────────────────────────────

-- RLS 정책 안에서 profiles를 다시 조회하면 재귀가 생기므로 security definer로 우회
create function public.is_admin() returns boolean
language sql stable security definer
set search_path = public
as $$
	select exists (
		select 1 from public.profiles
		where id = auth.uid() and role = 'admin'
	);
$$;

-- role 셀프 승격 방지: admin만 role 변경 가능
create function public.prevent_role_change() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
	if new.role is distinct from old.role and not public.is_admin() then
		raise exception 'role can only be changed by admin';
	end if;
	return new;
end;
$$;

create trigger profiles_prevent_role_change
	before update on public.profiles
	for each row execute function public.prevent_role_change();

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.partner_profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.chat_messages enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;

-- profiles: 본인 + admin
create policy "profiles_select_own_or_admin" on public.profiles
	for select using (id = auth.uid() or public.is_admin());
create policy "profiles_insert_own" on public.profiles
	for insert with check (id = auth.uid());
create policy "profiles_update_own_or_admin" on public.profiles
	for update using (id = auth.uid() or public.is_admin());

-- partner_profiles: 승인·활성 프로필은 로그인 사용자 모두 조회, 본인·admin은 항상
create policy "partner_profiles_select" on public.partner_profiles
	for select using (
		(is_approved and is_active and auth.uid() is not null)
		or profile_id = auth.uid()
		or public.is_admin()
	);
create policy "partner_profiles_insert_own" on public.partner_profiles
	for insert with check (profile_id = auth.uid());
create policy "partner_profiles_update_own_or_admin" on public.partner_profiles
	for update using (profile_id = auth.uid() or public.is_admin());

-- bookings: 당사자 + admin
create policy "bookings_select_participant_or_admin" on public.bookings
	for select using (
		customer_id = auth.uid() or partner_id = auth.uid() or public.is_admin()
	);
create policy "bookings_insert_customer" on public.bookings
	for insert with check (customer_id = auth.uid());
create policy "bookings_update_participant_or_admin" on public.bookings
	for update using (
		customer_id = auth.uid() or partner_id = auth.uid() or public.is_admin()
	);

-- chat_messages: 예약 당사자만 조회·작성. update/delete 정책 없음 = 수정·삭제 불가 (로그 보관)
create policy "chat_messages_select_participant_or_admin" on public.chat_messages
	for select using (
		exists (
			select 1 from public.bookings b
			where b.id = booking_id
				and (b.customer_id = auth.uid() or b.partner_id = auth.uid())
		)
		or public.is_admin()
	);
create policy "chat_messages_insert_participant" on public.chat_messages
	for insert with check (
		sender_id = auth.uid()
		and exists (
			select 1 from public.bookings b
			where b.id = booking_id
				and (b.customer_id = auth.uid() or b.partner_id = auth.uid())
		)
	);

-- reviews: 로그인 사용자 조회, 완료된 예약의 고객만 작성
create policy "reviews_select_authenticated" on public.reviews
	for select using (auth.uid() is not null);
create policy "reviews_insert_booking_customer" on public.reviews
	for insert with check (
		author_id = auth.uid()
		and exists (
			select 1 from public.bookings b
			where b.id = booking_id
				and b.customer_id = auth.uid()
				and b.status = 'completed'
		)
	);

-- reports: 본인 신고 작성·조회, 처리(update)는 admin만
create policy "reports_select_own_or_admin" on public.reports
	for select using (reporter_id = auth.uid() or public.is_admin());
create policy "reports_insert_own" on public.reports
	for insert with check (reporter_id = auth.uid());
create policy "reports_update_admin" on public.reports
	for update using (public.is_admin());

-- ── realtime ─────────────────────────────────────────────────────────────────

alter publication supabase_realtime add table public.chat_messages;
