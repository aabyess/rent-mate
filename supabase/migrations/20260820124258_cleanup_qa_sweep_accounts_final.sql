-- supabase/migrations/20260820124258_cleanup_qa_sweep_accounts_final.sql
-- QA 프로브 계정 최종 정리 (000005/164431/170225와 동일 패턴).
--
-- 실행 전 확인한 잔여 목록 (2026-08-20 기준, 1건):
--   qasweep11@rentmate-id.com / id 94effc96-0182-484c-afb6-3a3ec144fcd3 / name "QA덱뷰어"
--   (스와이프 덱 QA 때 만든 프로브 — 20260819170225 배치 이후 생성돼 누락됨)
-- 의존 행 확인: bookings/reports/blocks/reviews/payments 전부 0건 — 순수 프로필만 존재.

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
