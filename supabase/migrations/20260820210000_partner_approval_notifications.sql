-- supabase/migrations/20260820210000_partner_approval_notifications.sql
-- 파트너 승인·거절 알림 — enum 값 추가만. 같은 트랜잭션에서 새 enum 값을 바로 참조하는
-- 다음 마이그레이션(dedupe 인덱스)은 별도 파일로 분리한다 (PG: ADD VALUE는 커밋 전에
-- 같은 트랜잭션에서 사용할 수 없다).

alter type public.notification_type add value 'partner_approved';
alter type public.notification_type add value 'partner_rejected';
