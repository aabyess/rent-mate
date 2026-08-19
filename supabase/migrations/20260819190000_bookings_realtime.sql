-- supabase/migrations/20260819190000_bookings_realtime.sql
-- 예약 생성·상태 변경 실시간 알림용 퍼블리케이션 추가 (RLS로 당사자만 수신)

alter publication supabase_realtime add table public.bookings;
