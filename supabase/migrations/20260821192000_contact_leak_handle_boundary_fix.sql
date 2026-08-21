-- supabase/migrations/20260821192000_contact_leak_handle_boundary_fix.sql
-- 연락처 유도 감지(20260821191000)의 메신저 아이디 패턴 버그 수정.
-- Postgres ARE는 한글도 word character로 취급해서, 아이디 뒤에 조사가 바로
-- 붙는 자연스러운 한국어 문장("카톡 kyu123으로 연락줘")에서 뒤쪽 \y(단어 경계)가
-- 성립하지 않아 미감지됐다(클라이언트 JS \b는 한글을 non-word로 봐서 감지하므로
-- 클라·DB 비대칭 발생 — rehearsal로 재현 확인함).
-- 뒤쪽 \y를 제거해 "숫자/언더바/마침표가 나온 지점까지"만 확인하도록 완화한다.
-- 과탐(예: 진짜 아이디가 아닌데 매칭)은 flagged 전용이라 허용 — 차단 정책이 아님.

create or replace function public.flag_banned_chat_content() returns trigger
language plpgsql
set search_path = public
as $$
declare
	normalized text;
begin
	normalized := lower(regexp_replace(coalesce(new.content, ''), '[^가-힣a-zA-Z0-9]', '', 'g'));

	if public.contains_banned_phrase(new.content)
		-- 전화번호: 010-1234-5678 / 01012345678 / 02-123-4567 등
		or new.content ~ '(01[016789]|02|0[3-6][0-4]?)[-.[:space:]]?[0-9]{3,4}[-.[:space:]]?[0-9]{4}'
		-- 이메일
		or lower(new.content) ~ '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}'
		-- 메신저 유도 문구 + 아이디로 보이는 토큰(영문 시작, 숫자/언더바/마침표 포함) 조합.
		-- 뒤쪽 경계는 확인하지 않는다 — "kyu123으로"처럼 조사가 바로 붙는 경우도 잡기 위함.
		or (
			normalized ~ '(카톡|카카오톡|카카오|라인|텔레그램|텔레|인스타그램|인스타|디엠)'
			and lower(new.content) ~ '\y[a-z][a-z0-9_.]*[0-9_.]'
		)
	then
		new.flagged := true;
	end if;

	return new;
end;
$$;
