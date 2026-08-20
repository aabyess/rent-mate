-- supabase/migrations/20260820201500_cleanup_qa_sweep_accounts_3.sql
-- QA 프로브 계정 정리 (000005/164431/170225/124258와 동일 패턴).
--
-- 실행 전 확인한 잔여 목록 (2026-08-20 기준, 12건):
--   qasweep20~23@rentmate-id.com — 예약 중복 방지(오버랩) QA, bookings 8건
--   qasweep30~32@rentmate-id.com — 파트너 정산 QA, bookings 4건 + payments 4건
--   qasweep33~37@rentmate-id.com — 취소·환불 정책 QA, bookings 8건 (payments 없음 —
--     cancel_booking_with_refund RPC는 결제 완료 건에만 payments 행을 갱신하는데
--     이번 4케이스는 결제 전 상태로만 검증했음)
-- 의존 행 확인: chat_messages/reviews/reports/blocks 전부 0건.
-- payments는 refunded_amount_krw/cancellation_fee_krw 포함 행 전체를 DELETE로
-- 지우므로(부분 컬럼 삭제 아님) 리허설에서 삭제 전/후 count로 완전 삭제를 확인한다.

do $$
declare
	doomed uuid[];
begin
	select array_agg(id) into doomed
	from auth.users
	where email like 'qasweep%@rentmate-id.com';

	if doomed is null then
		return;
	end if;

	delete from public.payments
	where customer_id = any (doomed)
		or booking_id in (
			select id from public.bookings
			where customer_id = any (doomed) or partner_id = any (doomed)
		);
	delete from public.chat_messages
	where booking_id in (
		select id from public.bookings
		where customer_id = any (doomed) or partner_id = any (doomed)
	);
	delete from public.reviews
	where author_id = any (doomed)
		or booking_id in (
			select id from public.bookings
			where customer_id = any (doomed) or partner_id = any (doomed)
		);
	delete from public.reports
	where reporter_id = any (doomed) or target_id = any (doomed);
	delete from public.blocks
	where blocker_id = any (doomed) or blocked_id = any (doomed);
	delete from public.bookings
	where customer_id = any (doomed) or partner_id = any (doomed);

	-- auth.users 삭제가 profiles → partner_profiles로 cascade된다
	delete from auth.users where id = any (doomed);
end $$;
