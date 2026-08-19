-- supabase/migrations/20260819170225_cleanup_qa_sweep_accounts_2.sql
-- 결제 RLS·상태 전이·권한 상승 QA에 쓴 qasweep4~10 계정 정리.
-- 000005/164431과 동일 패턴 + payments 의존 행 삭제 추가
-- (payments.booking_id가 bookings를 on delete restrict로 참조).

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
