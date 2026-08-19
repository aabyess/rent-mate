-- supabase/migrations/20260819165515_lockdown_profiles_role_insert.sql
-- 긴급 보안 수정: profiles_insert_own 정책이 id = auth.uid()만 검사하고 role은
-- 제한하지 않아, 회원가입 시 클라이언트가 role: 'admin'을 페이로드에 직접 넣으면
-- 그대로 통과했다 (QA에서 재현 확인 — 신규 계정이 실제로 role=admin이 됨).
--
-- WITH CHECK로 "role = 'customer'"를 강제하는 방식은 쓰지 않는다: RLS WITH CHECK는
-- BEFORE 트리거 실행 *후*의 최종 행을 검사하므로, admin 이메일 가입 시
-- grant_admin_role 트리거가 role을 admin으로 바꾼 순간 그 검사에 걸려
-- admin 부트스트랩 자체가 거부된다.
--
-- 대신 트리거로 role을 강제한다. 같은 이벤트(BEFORE INSERT)의 트리거는 이름
-- 알파벳순으로 실행되므로:
--   profiles_enforce_customer_role (e) → profiles_grant_admin (g)
-- role을 먼저 무조건 customer로 되돌린 뒤, admin 이메일(로컬파트 'admin')만
-- 20260819080000/20260819163034에서 만든 profiles_grant_admin 트리거가
-- 다시 admin으로 승격한다. 그 트리거명이 이미 'g'로 시작해 순서가 맞으므로
-- 별도 리네임은 필요 없다.

create function public.enforce_customer_role_on_signup() returns trigger
language plpgsql
set search_path = public
as $$
begin
	new.role := 'customer';
	return new;
end;
$$;

create trigger profiles_enforce_customer_role
	before insert on public.profiles
	for each row execute function public.enforce_customer_role_on_signup();

-- 감사 스윕: 이 구멍으로 무단 승격됐을 수 있는 계정을 일괄 강등한다.
-- (실제 admin 아이디 계정만 예외) prevent_role_change 트리거는 auth.uid() 기반이라
-- 마이그레이션 컨텍스트에서 항상 예외를 던지므로 스윕 동안만 잠시 해제한다.
alter table public.profiles disable trigger profiles_prevent_role_change;

update public.profiles p
set role = 'customer'
from auth.users u
where u.id = p.id
	and p.role = 'admin'
	and split_part(u.email, '@', 1) <> 'admin';

alter table public.profiles enable trigger profiles_prevent_role_change;
