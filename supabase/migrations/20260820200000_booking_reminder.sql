-- supabase/migrations/20260820200000_booking_reminder.sql
-- 예약 리마인더 — 24시간 내 시작하는 accepted 예약의 고객·파트너 양쪽에 알림을 남긴다.
-- 리마인더는 예약당 수신자가 2명(고객+파트너)이라, 기존 (type, bookingId) 유니크 인덱스로는
-- 먼저 들어간 한쪽 insert 이후 나머지 한쪽이 중복으로 씹힌다. recipient_id를 포함해 재생성한다.

alter type public.notification_type add value 'booking_reminder';

drop index public.notifications_dedupe_idx;

create unique index notifications_dedupe_idx
	on public.notifications (type, (payload ->> 'bookingId'), recipient_id);
