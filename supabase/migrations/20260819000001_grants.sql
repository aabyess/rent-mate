-- supabase/migrations/20260819000001_grants.sql
-- anon/authenticated/service_role에 스키마·테이블 권한 부여.
-- 행 단위 접근 통제는 RLS 정책이 담당한다 (권한 grant만으로는 행이 노출되지 않음).

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to anon, authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;

-- 이후 마이그레이션에서 생성되는 객체에도 동일 권한 자동 부여
alter default privileges in schema public
	grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
	grant execute on functions to anon, authenticated, service_role;
