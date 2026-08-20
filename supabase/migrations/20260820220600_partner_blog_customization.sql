-- supabase/migrations/20260820220600_partner_blog_customization.sql
-- 파트너 블로그 채택률을 높이기 위한 개인화 — 인사말(짧은 한 줄)과 커버 사진.
-- 둘 다 선택 입력. blog_greeting은 파트너 상세의 "소식" 섹션 상단에 노출되는
-- 공개 지면이라 금칙어 거부 대상에 포함한다.

alter table public.partner_profiles
	add column blog_greeting text check (char_length(blog_greeting) <= 120),
	add column blog_cover_url text;

create or replace function public.reject_banned_partner_content() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.contains_banned_phrase(new.nickname)
		or public.contains_banned_phrase(new.bio)
		or public.contains_banned_phrase(new.blog_greeting) then
		raise exception '사용할 수 없는 표현이 포함되어 있어요. 성적 서비스를 연상시키는 표현은 제재 대상입니다.';
	end if;
	return new;
end;
$$;
