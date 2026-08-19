-- supabase/migrations/20260819163034_fix_admin_bootstrap_domain.sql
-- admin 부트스트랩 수정: 트리거가 구 합성 도메인(admin@id.rentmate.dev)을 기대해
-- 현 도메인(rentmate-id.com) 가입과 매치되지 않던 버그. 도메인 무관하게
-- 로컬파트 'admin'으로 판정하도록 바꾸고 (username 규칙상 유일), 기존 계정을 백필한다.
-- 리더 세션(c4) 스펙 + 사용자 승인 완료.

create or replace function public.grant_admin_role() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
	if exists (
		select 1 from auth.users u
		where u.id = new.id and split_part(u.email, '@', 1) = 'admin'
	) then
		new.role := 'admin';
	end if;
	return new;
end;
$$;

-- 이미 가입된 admin 계정이 customer로 남아 있으면 승격.
-- role 셀프 승격 방지 트리거는 auth.uid() 기반이라 마이그레이션 컨텍스트에서는
-- 항상 예외를 던지므로 백필 순간만 잠시 해제한다.
alter table public.profiles disable trigger profiles_prevent_role_change;

update public.profiles p
set role = 'admin'
from auth.users u
where u.id = p.id
	and split_part(u.email, '@', 1) = 'admin'
	and p.role <> 'admin';

alter table public.profiles enable trigger profiles_prevent_role_change;
