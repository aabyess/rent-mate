-- supabase/migrations/20260819154838_adult_verification_hardening.sql
-- 성인인증 게이트를 DB에서 강제한다 (청소년보호법 — 미인증 운영 시 형사처벌 대상인 핵심 요건).
-- 기존에는 클라이언트가 adult_verified_at을 임의로 넣을 수 있었다:
--   - profiles에 birth_date를 저장하고, insert 트리거가 연 나이(19세가 되는 해의 1월 1일부터 성인)를 검증
--   - adult_verified_at은 트리거만 세팅하며, 이후 birth_date/adult_verified_at 변조는 차단

alter table public.profiles
	add column birth_date date;

create function public.enforce_adult_verification() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if tg_op = 'UPDATE' then
		if new.birth_date is distinct from old.birth_date then
			raise exception '생년월일은 변경할 수 없습니다.';
		end if;
		if new.adult_verified_at is distinct from old.adult_verified_at then
			raise exception '성인인증 정보는 직접 수정할 수 없습니다.';
		end if;
		return new;
	end if;

	if new.birth_date is null then
		raise exception '생년월일을 입력해주세요.';
	end if;
	if extract(year from current_date) - extract(year from new.birth_date) < 19 then
		raise exception '만 19세 미만은 RentMate를 이용할 수 없습니다.';
	end if;
	new.adult_verified_at := now();
	return new;
end;
$$;

create trigger profiles_enforce_adult_verification
	before insert or update on public.profiles
	for each row execute function public.enforce_adult_verification();
