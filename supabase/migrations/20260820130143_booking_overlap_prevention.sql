-- supabase/migrations/20260820130143_booking_overlap_prevention.sql
-- 같은 파트너의 확정(accepted) 예약이 시간대가 겹친 채로 동시에 존재할 수 있던
-- 문제를 막는다. requested(대기) 상태끼리는 여러 명이 같은 시간대를 신청해도
-- 되고, 파트너가 그중 하나를 수락하는 순간부터 배타적이 된다.
--
-- 방어선 2단계:
--   1) EXCLUDE 제약 — 동시 트랜잭션 레이스까지 막는 최종 방어선(무조건 막음).
--   2) 상태 전이 트리거의 사전 조회 — 단일 요청 기준으로 먼저 걸려서 친절한
--      한국어 메시지를 준다. 레이스 상황(동시에 두 예약이 수락 시도)에서는
--      트리거 통과 후 EXCLUDE가 최종적으로 막을 수 있는데, 그 경우 클라이언트는
--      제약 이름/에러코드(23P01)로 감지해 동일한 문구를 보여준다.

create extension if not exists btree_gist;

-- '[)' 반개구간을 명시한다 — 폐구간이면 10~12시 예약과 12~14시 예약이 경계
-- 접촉만으로 겹침 오탐된다.
alter table public.bookings
	add constraint bookings_no_overlapping_accepted
	exclude using gist (
		partner_id with =,
		tstzrange(starts_at, ends_at, '[)') with &&
	)
	where (status = 'accepted');

create or replace function public.enforce_booking_status_transition() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if auth.uid() is null or public.is_admin() then
		return new;
	end if;

	if new.customer_id <> old.customer_id
		or new.partner_id <> old.partner_id
		or new.starts_at <> old.starts_at
		or new.ends_at <> old.ends_at
		or new.place <> old.place
		or new.total_amount_krw <> old.total_amount_krw then
		raise exception '예약 정보는 변경할 수 없습니다.';
	end if;

	if new.status = old.status then
		return new;
	end if;

	if old.status = 'requested' and new.status in ('accepted', 'rejected') then
		if old.partner_id <> auth.uid() then
			raise exception '파트너만 예약을 수락·거절할 수 있습니다.';
		end if;
		if new.status = 'accepted' and exists (
			select 1 from public.bookings b
			where b.partner_id = old.partner_id
				and b.id <> old.id
				and b.status = 'accepted'
				and tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(old.starts_at, old.ends_at, '[)')
		) then
			raise exception '이미 확정된 예약과 시간이 겹쳐요.';
		end if;
		return new;
	end if;

	if old.status in ('requested', 'accepted') and new.status = 'canceled' then
		if old.customer_id <> auth.uid() then
			raise exception '고객만 예약을 취소할 수 있습니다.';
		end if;
		return new;
	end if;

	if old.status = 'accepted' and new.status = 'completed' then
		if old.partner_id <> auth.uid() then
			raise exception '파트너만 완료 처리할 수 있습니다.';
		end if;
		if now() < old.starts_at then
			raise exception '데이트 시작 전에는 완료 처리할 수 없습니다.';
		end if;
		return new;
	end if;

	raise exception '허용되지 않는 예약 상태 변경입니다. (% → %)', old.status, new.status;
end;
$$;

-- 예약 스케줄 화면에서 해당 파트너의 이미 확정된 시간대를 보여주기 위한 조회 전용
-- RPC. bookings RLS는 당사자만 select 가능해 다른 고객이 예약 현황을 볼 수 없으므로,
-- 시간 범위만(고객 신원 등 다른 정보 없이) 반환하는 security definer 함수로 우회한다.
create function public.get_partner_accepted_slots(p_partner_id uuid)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql stable security definer
set search_path = public
as $$
	select b.starts_at, b.ends_at
	from public.bookings b
	where b.partner_id = p_partner_id
		and b.status = 'accepted'
		and b.ends_at >= now();
$$;

-- 로그인 사용자만 조회 가능 (팀 표준: 기본 grant를 authenticated로 좁힘)
revoke execute on function public.get_partner_accepted_slots(uuid) from anon;
