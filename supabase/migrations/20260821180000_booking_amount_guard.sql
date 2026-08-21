-- supabase/migrations/20260821180000_booking_amount_guard.sql
-- 예약 INSERT 정합성 강제 (리서치 발굴 · PM 실증: insert 정책이 customer_id만 검사해서
-- 클라이언트가 계산해 보내는 값을 무검증 수용했다).
--
-- 막는 것 두 가지:
-- 1) 금액 위조 — total_amount_krw를 낮춰 접수하면 approve_booking_payment는
--    "청구액 == 저장액"만 대조하므로 조작 금액으로 결제 완료 예약이 성립했다.
--    서버에서 hourly_rate_krw × 이용시간을 재계산해 대조한다 (클라 공식과 동일:
--    rate × minutes / 60. 반올림 허용은 정수 원 단위 오차 흡수용).
-- 2) 상태 위조 — 기존 상태 전이 가드는 UPDATE 전용이라, INSERT에서 status를
--    'completed' 등으로 넣으면 셀프 완료 → 즉시 후기 경로가 다시 열렸다.
--    접수는 반드시 'requested'로만.
-- admin과 서버 작업(auth.uid() null: service_role·마이그레이션·시드)은 제한 없음.

create function public.enforce_booking_insert() returns trigger
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
	where profile_id = new.partner_id;
	if v_rate is null then
		raise exception '파트너 정보를 찾을 수 없습니다.';
	end if;

	v_expected := round(v_rate * extract(epoch from (new.ends_at - new.starts_at)) / 3600.0);
	if new.total_amount_krw <> v_expected then
		raise exception '예약 금액이 올바르지 않습니다.';
	end if;

	return new;
end;
$$;

revoke execute on function public.enforce_booking_insert() from public, anon, authenticated;

create trigger bookings_enforce_insert
	before insert on public.bookings
	for each row execute function public.enforce_booking_insert();
