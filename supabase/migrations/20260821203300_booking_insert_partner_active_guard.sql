-- supabase/migrations/20260821203300_booking_insert_partner_active_guard.sql
-- 예약 INSERT 시 파트너가 승인(is_approved)·활성(is_active) 상태인지 확인하지
-- 않던 구멍 방어 (#124 리뷰에서 발견한 pre-existing gap). 미승인·비활성 파트너의
-- profile_id를 알면(예: 과거 캐시, URL 직접 조작) 예약이 성립할 수 있었다.
--
-- v1(20260821180000)의 enforce_booking_insert()를 CREATE OR REPLACE로 교체 —
-- 조회 조건에 is_approved and is_active 추가, 실패 시 메시지를 "파트너 정보를
-- 찾을 수 없습니다"에서 "예약할 수 없는 파트너입니다"로 통일한다(미존재/미승인/
-- 비활성 케이스를 하나의 메시지로 묶어 공격자에게 어떤 케이스인지 노출하지 않는
-- 부수 효과도 있음).

create or replace function public.enforce_booking_insert() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
	v_rate integer;
	v_expected integer;
begin
	if auth.uid() is null or public.is_admin() then
		return new;
	end if;

	if new.status <> 'requested' then
		raise exception '예약은 접수 상태로만 생성할 수 있습니다.';
	end if;

	select hourly_rate_krw into v_rate
	from public.partner_profiles
	where profile_id = new.partner_id and is_approved and is_active;
	if v_rate is null then
		raise exception '예약할 수 없는 파트너입니다.';
	end if;

	v_expected := round(v_rate * extract(epoch from (new.ends_at - new.starts_at)) / 3600.0);
	if new.total_amount_krw <> v_expected then
		raise exception '예약 금액이 올바르지 않습니다.';
	end if;

	return new;
end;
$$;
