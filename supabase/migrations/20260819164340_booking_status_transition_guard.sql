-- supabase/migrations/20260819164340_booking_status_transition_guard.sql
-- 예약 상태 전이를 DB에서 강제한다 (QA 발견: update 정책에 컬럼 제한이 없어
-- 고객이 status를 직접 completed로 바꿔 셀프 완료 → 즉시 후기 작성이 가능했고,
-- 에스크로 정산과 엮이면 정산 조작 경로가 된다).
--
-- 허용 전이 (당사자 기준):
--   requested → accepted | rejected : 파트너만
--   requested | accepted → canceled : 고객만
--   accepted → completed            : 파트너만, 데이트 시작 시각 이후
-- admin과 서버 작업(auth.uid() null: service_role·마이그레이션)은 제한 없음.
-- status 외 컬럼은 생성 후 변경 금지.

create function public.enforce_booking_status_transition() returns trigger
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

create trigger bookings_enforce_status_transition
	before update on public.bookings
	for each row execute function public.enforce_booking_status_transition();
