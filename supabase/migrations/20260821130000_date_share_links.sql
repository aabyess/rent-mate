-- supabase/migrations/20260821130000_date_share_links.sql
-- 데이트 일정 지인 공유 (틴더/범블 Share My Date 패턴) — 법적 제약 4번 안전 장치.
-- 예약 당사자가 신뢰하는 지인에게 일시·장소·상대 신원(이름+인증 여부)만 링크로
-- 공유한다. 사진·연락처·실제 ID는 절대 포함하지 않는다.

create table public.date_share_links (
	token text primary key default (
		replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')
	),
	booking_id uuid not null references public.bookings (id) on delete cascade,
	created_by uuid not null references public.profiles (id),
	expires_at timestamptz not null,
	created_at timestamptz not null default now()
);

create index date_share_links_booking_created_by_idx
	on public.date_share_links (booking_id, created_by, expires_at desc);

alter table public.date_share_links enable row level security;

-- v1은 생성·열람만 — update/delete 정책 없음(기본 거부)
create policy "date_share_links_select_participant" on public.date_share_links
	for select using (
		exists (
			select 1 from public.bookings b
			where b.id = date_share_links.booking_id
				and (b.customer_id = auth.uid() or b.partner_id = auth.uid())
		)
	);

create policy "date_share_links_insert_participant" on public.date_share_links
	for insert with check (
		created_by = auth.uid()
		and exists (
			select 1 from public.bookings b
			where b.id = date_share_links.booking_id
				and (b.customer_id = auth.uid() or b.partner_id = auth.uid())
		)
	);

-- 비로그인 열람용. 유효 토큰이면 일시·장소·상대 이름·상대 성인인증 여부만
-- 반환한다. anon 실행이 이 함수의 목적이라 execute를 public/anon에서
-- revoke하지 않는다 (다른 security definer 함수와 의도적으로 다른 지점).
create or replace function public.get_shared_date(p_token text)
returns table (
	starts_at timestamptz,
	ends_at timestamptz,
	place text,
	counterpart_name text,
	is_adult_verified boolean,
	is_expired boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
	v_link record;
	v_booking record;
	v_counterpart_id uuid;
	v_counterpart_name text;
begin
	select * into v_link from public.date_share_links where token = p_token;
	if not found then
		return;
	end if;

	if v_link.expires_at <= now() then
		return query select null::timestamptz, null::timestamptz, null::text, null::text, null::boolean, true;
		return;
	end if;

	select * into v_booking from public.bookings where id = v_link.booking_id;
	if not found then
		return;
	end if;

	v_counterpart_id := case
		when v_link.created_by = v_booking.customer_id then v_booking.partner_id
		else v_booking.customer_id
	end;

	-- 상대가 파트너면 활동 닉네임을, 상대가 고객이면 profiles.name을 — 기존
	-- counterpartName 계산(features/bookings/apis.ts)과 동일한 기준이라 이
	-- 페이지에서 새로 노출되는 정보 범주는 없다.
	if v_counterpart_id = v_booking.partner_id then
		select pp.nickname into v_counterpart_name
		from public.partner_profiles pp where pp.profile_id = v_counterpart_id;
	else
		select p.name into v_counterpart_name
		from public.profiles p where p.id = v_counterpart_id;
	end if;

	return query
	select
		v_booking.starts_at,
		v_booking.ends_at,
		v_booking.place,
		coalesce(v_counterpart_name, '알 수 없음'),
		exists (
			select 1 from public.profiles p
			where p.id = v_counterpart_id and p.adult_verified_at is not null
		),
		false;
end;
$$;

grant execute on function public.get_shared_date(text) to anon, authenticated;
