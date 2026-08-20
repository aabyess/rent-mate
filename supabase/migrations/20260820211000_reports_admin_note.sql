-- supabase/migrations/20260820211000_reports_admin_note.sql
-- 관리자 신고 처리 메모. reports_update_admin 정책이 컬럼 제한 없이
-- is_admin()이면 UPDATE 전체를 허용하므로 별도 RLS 정책은 불필요하다.

alter table public.reports
	add column admin_note text;
