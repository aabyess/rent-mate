-- supabase/migrations/20260820161000_content_filter_tune.sql
-- #71 리뷰 반영: "성인만남"이 부정문("성인 만남 알선이 아닌 건전한 데이트...")에서
-- 오탐되어 목록에서 제거한다 — 해당 의도는 조건만남·성매매·페이만남이 이미 커버.
-- "스폰"은 유지: 이 도메인에서 "스폰서"는 무관한 비즈니스 용어가 아니라 그 자체가
-- 유해 용법이다. 목록은 utils/bannedPhrases.ts와 함께 수정할 것.

create or replace function public.contains_banned_phrase(input text) returns boolean
language sql immutable
set search_path = public
as $$
	select lower(regexp_replace(coalesce(input, ''), '[^가-힣a-zA-Z0-9]', '', 'g'))
		~ '(조건만남|조건녀|스폰|원나잇|잠자리|성관계|유사성행위|성매매|출장만남|출장안마|모텔|러브호텔|섹스|섹파|화대|페이만남|키스방|안마방|풀싸롱|립카페|핸플|대딸|오랄)';
$$;
