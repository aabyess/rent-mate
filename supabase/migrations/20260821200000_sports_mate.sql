-- supabase/migrations/20260821200000_sports_mate.sql
-- 운동 메이트 P2P v1 — 1단계 스키마. sports_mate_posts(모집글) + sports_mate_requests(신청/수락)
-- 둘 다 이번에 만든다 — 2단계(신청/수락 UI·매칭 채팅)가 스키마 마이그레이션 없이 바로 붙을 수 있게.
-- 1단계는 모집글 CRUD만 구현하고, 신청/수락 자체는 아직 앱 레이어가 없다.
--
-- 노출 최소화: profiles를 직접 join하지 않는다. profile_private 건과 같은 이유로 —
-- 다른 사람의 profiles 행을 통째로 노출하는 정책을 추가하고 싶지 않다. 대신
-- partner_profiles.nickname 패턴처럼 표시용 이름을 테이블에 스냅샷으로 저장하고,
-- 클라이언트 입력을 신뢰하지 않고 트리거가 profiles.name으로 서버에서 덮어쓴다(위조 방지).

create table public.sports_mate_posts (
	id uuid primary key default gen_random_uuid(),
	author_id uuid not null references public.profiles (id) on delete cascade,
	author_name text not null default '',
	-- 종목 라벨은 features/bookings/components/BookingFlow/BookingFlowStepCourse.tsx의
	-- COURSE_CATEGORIES 운동 항목(배드민턴·풋살·볼링)과 동기화할 것
	sport text not null,
	-- constants/regions.ts REGIONS와 동기화할 것 (파트너 활동 지역과 같은 패턴, CHECK 없음)
	region text not null,
	preferred_date date not null,
	time_slot text not null check (time_slot in ('morning', 'afternoon', 'evening', 'anytime')),
	gender_mode text not null check (gender_mode in ('same_gender', 'any')),
	comment text not null default '' check (char_length(comment) <= 100),
	-- matched는 2단계 수락 로직 몫 — 1단계 앱 코드는 open/closed만 실제로 세팅한다
	status text not null default 'open' check (status in ('open', 'matched', 'closed')),
	created_at timestamptz not null default now()
);

alter table public.sports_mate_posts enable row level security;

create policy "sports_mate_posts_select" on public.sports_mate_posts
	for select using (status = 'open' or author_id = auth.uid() or public.is_admin());
create policy "sports_mate_posts_insert_own" on public.sports_mate_posts
	for insert with check (author_id = auth.uid());
create policy "sports_mate_posts_update_own" on public.sports_mate_posts
	for update using (author_id = auth.uid() or public.is_admin());

create index sports_mate_posts_open_idx on public.sports_mate_posts (created_at desc)
	where status = 'open';

create function public.set_sports_mate_post_author_name() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	select name into new.author_name from public.profiles where id = new.author_id;
	return new;
end;
$$;

create trigger sports_mate_posts_set_author_name
	before insert on public.sports_mate_posts
	for each row execute function public.set_sports_mate_post_author_name();

-- 모집글 한마디는 공개 지면이라 파트너 블로그·QNA와 동일하게 감지가 아니라 거부한다
create function public.reject_banned_sports_mate_content() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.contains_banned_phrase(new.comment) then
		raise exception '사용할 수 없는 표현이 포함되어 있어요. 성적 서비스를 연상시키는 표현은 제재 대상입니다.';
	end if;
	return new;
end;
$$;

create trigger sports_mate_posts_reject_banned_content
	before insert or update on public.sports_mate_posts
	for each row execute function public.reject_banned_sports_mate_content();

-- 2단계 스키마(신청/수락) — 매칭 채팅(3단계)은 이 테이블 id를 참조해 연결한다
create table public.sports_mate_requests (
	id uuid primary key default gen_random_uuid(),
	post_id uuid not null references public.sports_mate_posts (id) on delete cascade,
	requester_id uuid not null references public.profiles (id) on delete cascade,
	requester_name text not null default '',
	status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
	created_at timestamptz not null default now(),
	unique (post_id, requester_id)
);

alter table public.sports_mate_requests enable row level security;

create policy "sports_mate_requests_select" on public.sports_mate_requests
	for select using (
		requester_id = auth.uid()
		or exists (
			select 1 from public.sports_mate_posts p
			where p.id = sports_mate_requests.post_id and p.author_id = auth.uid()
		)
		or public.is_admin()
	);
create policy "sports_mate_requests_insert_own" on public.sports_mate_requests
	for insert with check (requester_id = auth.uid());
-- 2단계 수락/거절 로직이 이 정책을 그대로 쓸 수 있도록 미리 걸어둔다
create policy "sports_mate_requests_update_post_author" on public.sports_mate_requests
	for update using (
		exists (
			select 1 from public.sports_mate_posts p
			where p.id = sports_mate_requests.post_id and p.author_id = auth.uid()
		)
		or public.is_admin()
	);

create function public.set_sports_mate_request_requester_name() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
	select name into new.requester_name from public.profiles where id = new.requester_id;
	return new;
end;
$$;

create trigger sports_mate_requests_set_requester_name
	before insert on public.sports_mate_requests
	for each row execute function public.set_sports_mate_request_requester_name();
