-- supabase/migrations/20260819180000_cleanup_probe_accounts.sql
-- 가입 진단에 쓴 probe/smoke 계정 정리 (프로필 미생성 상태라 의존 행 없음)

delete from auth.users
where email like 'probe0819@%'
	or email = 'smoketest@rentmate-id.com';
