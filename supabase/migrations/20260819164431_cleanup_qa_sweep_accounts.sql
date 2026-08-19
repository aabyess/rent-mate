-- supabase/migrations/20260819164431_cleanup_qa_sweep_accounts.sql
-- 통합 QA 스윕에 쓴 qasweep* 계정 정리. 시드 파트너와의 예약·채팅·신고까지
-- 남겼으므로 000005와 동일하게 의존 행부터 삭제한다.

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
