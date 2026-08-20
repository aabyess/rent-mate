-- supabase/migrations/20260820160000_content_filter_hardening.sql
-- 유해 표현 차단 강화 (성매매알선처벌법 리스크 — CLAUDE.md 법적 제약 3번):
--   1) 금칙어 판정을 공용 함수 contains_banned_phrase로 통합 + 목록 확장
--   2) 채팅은 기존 정책 유지 — 저장은 허용하되 flagged (대화 보존·증거 목적)
--   3) 공개 지면(파트너 닉네임·소개, 후기, 예약 장소)은 저장 자체를 거부
-- ⚠️ 금칙어 목록의 원본은 이 함수다. utils/bannedPhrases.ts의 BANNED_PHRASES와
-- 반드시 함께 수정할 것 (클라이언트는 전송 전 UX 차단, DB는 최종 방어선).

create function public.contains_banned_phrase(input text) returns boolean
language sql immutable
set search_path = public
as $$
	select lower(regexp_replace(coalesce(input, ''), '[^가-힣a-zA-Z0-9]', '', 'g'))
		~ '(조건만남|조건녀|스폰|원나잇|잠자리|성관계|유사성행위|성매매|출장만남|출장안마|모텔|러브호텔|섹스|섹파|화대|페이만남|성인만남|키스방|안마방|풀싸롱|립카페|핸플|대딸|오랄)';
$$;

-- 채팅 플래깅 트리거를 공용 함수 기반으로 교체 (목록 확장 효과 포함)
create or replace function public.flag_banned_chat_content() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.contains_banned_phrase(new.content) then
		new.flagged := true;
	end if;
	return new;
end;
$$;

-- 파트너 프로필: 공개 지면이므로 거부 (탈퇴 익명화 문구 '탈퇴한 파트너'는 안 걸린다)
create function public.reject_banned_partner_content() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.contains_banned_phrase(new.nickname) or public.contains_banned_phrase(new.bio) then
		raise exception '사용할 수 없는 표현이 포함되어 있어요. 성적 서비스를 연상시키는 표현은 제재 대상입니다.';
	end if;
	return new;
end;
$$;

create trigger partner_profiles_reject_banned_content
	before insert or update on public.partner_profiles
	for each row execute function public.reject_banned_partner_content();

-- 후기: 공개 지면이므로 거부
create function public.reject_banned_review_content() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.contains_banned_phrase(new.content) then
		raise exception '사용할 수 없는 표현이 포함되어 있어요.';
	end if;
	return new;
end;
$$;

create trigger reviews_reject_banned_content
	before insert or update on public.reviews
	for each row execute function public.reject_banned_review_content();

-- 예약 장소: 공개 장소 원칙 — 숙박업소 등 금지 표현이 든 장소는 거부.
-- update는 전이 가드가 place 불변을 강제하므로 insert만 검사한다.
create function public.reject_banned_booking_place() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.contains_banned_phrase(new.place) then
		raise exception '데이트는 공개된 장소에서만 가능해요. 해당 장소는 선택할 수 없어요.';
	end if;
	return new;
end;
$$;

create trigger bookings_reject_banned_place
	before insert on public.bookings
	for each row execute function public.reject_banned_booking_place();
