-- supabase/migrations/20260821160000_review_axis_ratings.sql
-- 후기 4축 평점 — 시간 약속 / 대화·매너 / 안전하다고 느꼈어요 / 다시 만나고 싶어요
-- (각 1~5). 기존 rating은 유지하되(평균·목록 로직 무수정 호환), 작성 폼에서는
-- 더 이상 직접 받지 않고 "다시 만나고 싶어요" 값을 그대로 복사해 저장한다.
-- 기존 행은 4축 데이터가 없어 전부 nullable.

alter table public.reviews
	add column timeliness_rating smallint check (timeliness_rating between 1 and 5),
	add column manner_rating smallint check (manner_rating between 1 and 5),
	add column safety_rating smallint check (safety_rating between 1 and 5),
	add column would_meet_again_rating smallint check (would_meet_again_rating between 1 and 5),
	add column safety_flagged boolean not null default false;

-- safety_flagged는 클라이언트가 직접 값을 보낼 수 없다 — 트리거가 safety_rating
-- 기준으로 강제 산출한다(문의 status 스푸핑 사례와 동일한 이유의 방어).
create function public.flag_low_safety_review() returns trigger
language plpgsql
set search_path = public
as $$
begin
	new.safety_flagged := (new.safety_rating is not null and new.safety_rating <= 2);
	return new;
end;
$$;

create trigger reviews_flag_low_safety
	before insert on public.reviews
	for each row execute function public.flag_low_safety_review();
