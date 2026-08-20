-- supabase/migrations/20260820220500_cleanup_seed_partners.sql
-- 데모 시드 파트너 전체 삭제 (사용자 지시: "가짜 파트너 계정 삭제, 이미지까지").
-- 대상: 고정 UUID 프리픽스 '11111111-1111-4111-8111-1111111%' 106개 계정
--   (원년 시드 101~106, 여성 풀 2xx 50명, 남성 풀 3xx 50명).
-- 실계정(지지·뀨뀨·사용자 계정들)은 프리픽스가 달라 영향 없음.
-- 스토리지 seed/ 사진 삭제는 DB 트랜잭션 밖(스크립트)에서 별도 수행.
--
-- 삭제 순서 주의:
--   * notifications.recipient_id FK는 non-cascade (qasweep 배치 교훈)
--   * chat_reads.booking_id FK는 on delete RESTRICT — 기존 정리 템플릿에 없던 항목,
--     예약 삭제 전에 반드시 지워야 한다
--   * 시드 예약에 얽힌 실사용자 알림(payload bookingId)도 함께 정리 (깨진 딥링크 방지)

do $$
declare
	doomed uuid[];
	doomed_bookings uuid[];
begin
	select array_agg(id) into doomed
	from public.profiles
	where id::text like '11111111-1111-4111-8111-1111111%';

	if doomed is null then
		return;
	end if;

	select array_agg(id) into doomed_bookings
	from public.bookings
	where customer_id = any (doomed) or partner_id = any (doomed);

	delete from public.notifications where recipient_id = any (doomed);

	if doomed_bookings is not null then
		delete from public.notifications
		where (payload ->> 'bookingId')::uuid = any (doomed_bookings);
		delete from public.chat_reads where booking_id = any (doomed_bookings);
		delete from public.payments where booking_id = any (doomed_bookings);
		delete from public.chat_messages where booking_id = any (doomed_bookings);
		delete from public.reviews where booking_id = any (doomed_bookings);
	end if;

	delete from public.payments where customer_id = any (doomed);
	delete from public.reviews where author_id = any (doomed);
	delete from public.reports where reporter_id = any (doomed) or target_id = any (doomed);
	delete from public.blocks where blocker_id = any (doomed) or blocked_id = any (doomed);
	delete from public.partner_likes
	where customer_id = any (doomed) or partner_id = any (doomed);
	delete from public.partner_bookmarks
	where customer_id = any (doomed) or partner_id = any (doomed);
	delete from public.chat_reads where reader_id = any (doomed);

	if doomed_bookings is not null then
		delete from public.bookings where id = any (doomed_bookings);
	end if;

	-- auth.users 삭제가 profiles → partner_profiles/partner_posts/customer_preferences로 cascade
	delete from auth.users where id = any (doomed);
end $$;
