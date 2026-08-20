-- supabase/migrations/20260820151500_cancellation_refund_policy.sql
-- 취소·환불 정책: 데이트 시작 24시간 전까지 무료 취소, 이후에는 결제 금액의
-- 50%가 수수료로 남는다. 시작 이후에는 취소 자체가 불가하다(기존 전이
-- 트리거는 시간 제한이 없어 이 RPC 레벨에서만 막는다 — 트리거를 바꾸면
-- 기존 동작 범위가 넓어져 리스크가 있어 별도 논의로 미룬다).
-- 정책 상수(24시간/50%)는 features/bookings/utils.ts의
-- FREE_CANCELLATION_WINDOW_HOURS/LATE_CANCELLATION_FEE_RATIO와 동일하게
-- 유지할 것 — 클라이언트는 미리보기용, 여기가 최종 권위.

alter table public.payments
	add column refunded_amount_krw integer,
	add column cancellation_fee_krw integer;

-- 실제 결제 게이트웨이(토스) 취소 호출은 PL/pgSQL에서 할 수 없으므로 API 라우트
-- (app/api/bookings/[bookingId]/cancel/route.ts)에서 처리하고, 이 RPC는 그
-- 결과를 신뢰해 DB 상태만 기록한다. 라우트가 이 RPC를 호출하기 전에 게이트웨이
-- 취소를 먼저 시도해 실패 시 DB를 건드리지 않도록 순서를 지킨다.
create function public.cancel_booking_with_refund(p_booking_id uuid)
returns table (fee_krw integer, refund_krw integer, had_payment boolean)
language plpgsql security definer
set search_path = public
as $$
declare
	v_booking public.bookings%rowtype;
	v_payment public.payments%rowtype;
	v_hours_until_start numeric;
	v_fee integer;
	v_refund integer;
	v_had_payment boolean := false;
begin
	select * into v_booking from public.bookings where id = p_booking_id for update;
	if not found then
		raise exception '예약을 찾을 수 없습니다.';
	end if;
	if v_booking.customer_id <> auth.uid() then
		raise exception '고객만 예약을 취소할 수 있습니다.';
	end if;
	if v_booking.status not in ('requested', 'accepted') then
		raise exception '취소할 수 없는 예약 상태입니다.';
	end if;
	if v_booking.starts_at <= now() then
		raise exception '이미 시작된 예약은 취소할 수 없어요. 문제가 있다면 신고 기능을 이용해주세요.';
	end if;

	v_hours_until_start := extract(epoch from (v_booking.starts_at - now())) / 3600;
	if v_hours_until_start >= 24 then
		v_fee := 0;
	else
		v_fee := floor(v_booking.total_amount_krw * 0.5);
	end if;
	v_refund := v_booking.total_amount_krw - v_fee;

	select * into v_payment from public.payments where booking_id = p_booking_id;
	if found and v_payment.status = 'paid' then
		v_had_payment := true;
		update public.payments
		set status = 'refunded', refunded_amount_krw = v_refund, cancellation_fee_krw = v_fee
		where id = v_payment.id;
	end if;

	-- status 외 컬럼은 불변·타이밍 검증은 기존 전이 트리거(bookings_enforce_status_transition)가
	-- 다시 한 번 확인한다. auth.uid()는 security definer와 무관하게 호출자 JWT 기준이라
	-- 위에서 이미 검증한 소유자 조건과 트리거의 조건이 동일하게 통과한다.
	update public.bookings set status = 'canceled' where id = p_booking_id;

	return query select v_fee, v_refund, v_had_payment;
end;
$$;

revoke execute on function public.cancel_booking_with_refund(uuid) from public, anon;
grant execute on function public.cancel_booking_with_refund(uuid) to authenticated;
