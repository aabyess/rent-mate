-- supabase/migrations/20260819000005_cleanup_test_accounts.sql
-- 아이디 로그인 전환에 따른 일회성 정리: 이메일 방식으로 만들었던 테스트 계정 삭제.
-- 시드 파트너(@seed.rentmate.local)는 보존. created_at 날짜 가드로 이후 가입자는 영향 없음.

do $$
declare
	doomed uuid[];
begin
	select array_agg(id) into doomed
	from auth.users
	where email not like '%@seed.rentmate.local'
		and created_at < timestamptz '2026-08-20 00:00:00+09';

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
	delete from public.bookings
	where customer_id = any (doomed) or partner_id = any (doomed);

	-- auth.users 삭제가 profiles → partner_profiles로 cascade된다
	delete from auth.users where id = any (doomed);
end $$;
