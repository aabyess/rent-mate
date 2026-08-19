-- supabase/migrations/20260819080000_admin_bootstrap.sql
-- 관리자 부트스트랩: 아이디 "admin"(합성 이메일 admin@id.rentmate.dev)으로 가입한 계정에
-- 프로필 생성 시점에 admin 역할을 부여한다.

create function public.grant_admin_role() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
	if exists (
		select 1 from auth.users u
		where u.id = new.id and u.email = 'admin@id.rentmate.dev'
	) then
		new.role := 'admin';
	end if;
	return new;
end;
$$;

create trigger profiles_grant_admin
	before insert on public.profiles
	for each row execute function public.grant_admin_role();
