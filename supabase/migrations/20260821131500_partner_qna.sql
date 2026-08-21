-- supabase/migrations/20260821131500_partner_qna.sql
-- 파트너 고정 Q&A 프로필(7문항). 개수 제약은 interests/purpose_tags와 동일하게 클라 검증만 —
-- DB는 jsonb 자유 저장 + 금칙어 검사만 담당한다.

alter table public.partner_profiles add column qna jsonb not null default '{}';

-- qna 전체를 text로 캐스팅해 한 번에 검사 — 짧은 답변 필드가 늘어나도 자동으로 커버된다.
create or replace function public.reject_banned_partner_content() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.contains_banned_phrase(new.nickname)
		or public.contains_banned_phrase(new.bio)
		or public.contains_banned_phrase(new.qna::text)
	then
		raise exception '사용할 수 없는 표현이 포함되어 있어요. 성적 서비스를 연상시키는 표현은 제재 대상입니다.';
	end if;
	return new;
end;
$$;
