-- supabase/migrations/20260819155228_chat_banned_phrase_flagging.sql
-- 조건만남 유도 채팅 감지 (성매매알선처벌법 리스크 — 기술적 안전조치):
-- 금칙어가 감지된 메시지를 flagged로 기록한다. 전송 자체는 막지 않는다 —
-- 대화 저장 의무(삭제 불가 로그)와 제재·모니터링 근거 확보가 목적이며,
-- admin은 기존 select 정책(is_admin)으로 flagged 메시지를 조회할 수 있다.
-- 금칙어 목록은 features/chats/utils.ts의 BANNED_PHRASES와 동일하게 유지할 것.

alter table public.chat_messages
	add column flagged boolean not null default false;

create function public.flag_banned_chat_content() returns trigger
language plpgsql
set search_path = public
as $$
declare
	normalized text;
begin
	-- 띄어쓰기·특수문자 우회 방지: 한글·영문·숫자만 남기고 검사
	normalized := lower(regexp_replace(new.content, '[^가-힣a-zA-Z0-9]', '', 'g'));
	if normalized ~ '(조건만남|스폰|원나잇|잠자리|성관계|유사성행위|성매매|출장만남|모텔|러브호텔)' then
		new.flagged := true;
	end if;
	return new;
end;
$$;

create trigger chat_messages_flag_banned_content
	before insert on public.chat_messages
	for each row execute function public.flag_banned_chat_content();

create index chat_messages_flagged_idx on public.chat_messages (created_at desc) where flagged;
