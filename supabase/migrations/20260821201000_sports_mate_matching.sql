-- supabase/migrations/20260821201000_sports_mate_matching.sql
-- 운동 메이트 P2P v1 — 2단계: 신청 수락/거절 + matched 전이 강제 + 매칭 채팅.

-- 1단계 insert 정책이 requester_id = auth.uid()만 검사해 (PM 리뷰 지적) 글 작성자가
-- 자기 글에 셀프 신청하거나 closed/matched 글에도 신청할 수 있었다. 신청자 ≠ 작성자 +
-- 대상 글이 open일 때만 신청 가능하도록 좁힌다.
drop policy "sports_mate_requests_insert_own" on public.sports_mate_requests;
create policy "sports_mate_requests_insert_own" on public.sports_mate_requests
	for insert with check (
		requester_id = auth.uid()
		and exists (
			select 1 from public.sports_mate_posts p
			where p.id = post_id and p.status = 'open' and p.author_id <> auth.uid()
		)
	);

-- 신청자가 자기 pending 신청을 취소할 수단이 없었다(PM 리뷰 후순위 기록) — 상태값을
-- 추가해 신청자 본인이 pending -> cancelled로만 전이할 수 있게 한다.
alter table public.sports_mate_requests drop constraint sports_mate_requests_status_check;
alter table public.sports_mate_requests
	add constraint sports_mate_requests_status_check
	check (status in ('pending', 'accepted', 'declined', 'cancelled'));

create policy "sports_mate_requests_update_own_cancel" on public.sports_mate_requests
	for update using (requester_id = auth.uid() and status = 'pending')
	with check (requester_id = auth.uid() and status = 'cancelled');

-- 신청자도 자신이 신청한 글은 상태와 무관하게 조회할 수 있어야 한다(수락 여부 확인,
-- 매칭 채팅 진입에 필요한 글 정보 조회). 민감정보 없는 공개 지면(sport/region/date/comment)
-- 이라 profile_private 건과 달리 조회 확장이 안전하다.
--
-- sports_mate_requests_select 정책이 sports_mate_posts를 참조하므로, 여기서 다시
-- sports_mate_requests를 raw exists로 참조하면 두 정책이 서로를 호출하며 무한 재귀가
-- 난다(리허설 중 42P17로 실제 발견). is_admin()과 같은 이유로 security definer 헬퍼로
-- RLS 재평가를 우회해 순환을 끊는다.
create function public.is_sports_mate_requester(p_post_id uuid) returns boolean
language sql stable security definer
set search_path = public
as $$
	select exists (
		select 1 from public.sports_mate_requests r
		where r.post_id = p_post_id and r.requester_id = auth.uid()
	);
$$;

drop policy "sports_mate_posts_select" on public.sports_mate_posts;
create policy "sports_mate_posts_select" on public.sports_mate_posts
	for select using (
		status = 'open'
		or author_id = auth.uid()
		or public.is_sports_mate_requester(id)
		or public.is_admin()
	);

-- matched는 실제 accepted 신청이 있을 때만 세팅 가능 — 1단계에서 accept 플로우가 없어
-- 보류했던 셀프 매칭 위조 방지 가드. 이제 아래 accept_sports_mate_request가 유일한
-- 정상 경로이므로 추가한다.
create function public.enforce_sports_mate_post_status() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if new.status = 'matched' and old.status is distinct from 'matched' then
		if not exists (
			select 1 from public.sports_mate_requests r
			where r.post_id = new.id and r.status = 'accepted'
		) then
			raise exception '수락된 신청이 있어야 매칭 상태로 바꿀 수 있어요.';
		end if;
	end if;
	return new;
end;
$$;

create trigger sports_mate_posts_enforce_status
	before update on public.sports_mate_posts
	for each row execute function public.enforce_sports_mate_post_status();

-- 신청 수락 — 신청 상태 + 같은 글의 다른 pending 신청 자동 거절 + 글 상태 전이를
-- 하나의 트랜잭션으로 묶는다(여러 테이블 원자적 변경은 RPC 규칙).
create function public.accept_sports_mate_request(p_request_id uuid) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
	v_post_id uuid;
	v_author_id uuid;
	v_request_status text;
begin
	select post_id, status into v_post_id, v_request_status
	from public.sports_mate_requests where id = p_request_id;
	if v_post_id is null then
		raise exception '신청을 찾을 수 없습니다.';
	end if;
	if v_request_status <> 'pending' then
		raise exception '이미 처리된 신청입니다.';
	end if;

	select author_id into v_author_id from public.sports_mate_posts where id = v_post_id;
	if v_author_id is distinct from auth.uid() then
		raise exception '이 모집글의 작성자만 수락할 수 있습니다.';
	end if;

	update public.sports_mate_requests set status = 'accepted' where id = p_request_id;
	update public.sports_mate_requests set status = 'declined'
		where post_id = v_post_id and id <> p_request_id and status = 'pending';
	update public.sports_mate_posts set status = 'matched' where id = v_post_id;
end;
$$;

revoke execute on function public.accept_sports_mate_request(uuid) from public, anon;
grant execute on function public.accept_sports_mate_request(uuid) to authenticated;

-- 매칭 채팅 — 예약 채팅과 동일 보안 패턴: 당사자만 select/insert, update/delete 정책 없음
-- (대화 저장 의무 — 삭제 불가 로그). accepted 신청만 채팅방이 열린다.
create table public.sports_mate_messages (
	id uuid primary key default gen_random_uuid(),
	request_id uuid not null references public.sports_mate_requests (id) on delete restrict,
	sender_id uuid not null references public.profiles (id),
	content text not null check (length(content) between 1 and 2000),
	flagged boolean not null default false,
	created_at timestamptz not null default now()
);

alter table public.sports_mate_messages enable row level security;

create policy "sports_mate_messages_select_participant_or_admin" on public.sports_mate_messages
	for select using (
		exists (
			select 1 from public.sports_mate_requests r
			join public.sports_mate_posts p on p.id = r.post_id
			where r.id = request_id
				and r.status = 'accepted'
				and (r.requester_id = auth.uid() or p.author_id = auth.uid())
		)
		or public.is_admin()
	);
create policy "sports_mate_messages_insert_participant" on public.sports_mate_messages
	for insert with check (
		sender_id = auth.uid()
		and exists (
			select 1 from public.sports_mate_requests r
			join public.sports_mate_posts p on p.id = r.post_id
			where r.id = request_id
				and r.status = 'accepted'
				and (r.requester_id = auth.uid() or p.author_id = auth.uid())
		)
	);

create index sports_mate_messages_request_id_idx on public.sports_mate_messages (request_id, created_at);

-- 조건만남·연락처 유출 감지는 채팅 공용 트리거 함수를 그대로 재사용한다(새 함수 정의 없음) —
-- 목록이 바뀌면(예: contact leak 키워드 확장) 이 테이블도 자동으로 최신 기준을 따른다.
create trigger sports_mate_messages_flag_banned_content
	before insert on public.sports_mate_messages
	for each row execute function public.flag_banned_chat_content();
