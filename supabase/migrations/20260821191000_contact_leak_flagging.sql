-- supabase/migrations/20260821191000_contact_leak_flagging.sql
-- 외부 연락처 유도 감지 (기술적 안전조치 — 대화가 앱 밖으로 나가면 채팅 저장·모니터링이
-- 무력화됨). 확정된 정책: 차단 아님 — 전화번호·이메일·메신저 아이디 유도가 감지돼도
-- 전송은 그대로 진행하고 flagged만 등록한다(정당한 연락처 교환까지 막지 않기 위함).
-- 새 컬럼·새 큐를 만들지 않고 기존 chat_messages.flagged +
-- flag_banned_chat_content 트리거를 확장하는 방식으로 처리한다.
-- ⚠️ 감지 로직의 클라이언트측 대응은 utils/contactLeakKeywords.ts — 목록을 바꿀 땐
-- 반드시 함께 수정할 것. Postgres ARE는 lookahead(JS의 (?!\d))를 지원하지 않아
-- 클라이언트 정규식과 완전히 동일하지는 않다(rehearsal로 오탐 없음 확인함).

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
		-- 메신저 유도 문구 + 아이디로 보이는 토큰(영문 시작, 숫자/언더바/마침표 포함) 조합
		or (
			normalized ~ '(카톡|카카오톡|카카오|라인|텔레그램|텔레|인스타그램|인스타|디엠)'
			and lower(new.content) ~ '\y[a-z][a-z0-9_.]*[0-9_.][a-z0-9_.]*\y'
		)
	then
		new.flagged := true;
	end if;

	return new;
end;
$$;
