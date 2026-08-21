-- supabase/migrations/20260821202000_sports_mate_matching_fixes.sql
-- 운동 메이트 2단계(#139) PM 리뷰 지적 2건 수정.

-- ① accept RPC 동시 수락 레이스 (P1): 기존 accept UPDATE에 status 조건이 없어서,
-- 같은 글의 두 신청(r1, r2)을 거의 동시에 각각 수락하면 r2쪽 트랜잭션이 r1의 자동
-- declined 처리를 못 보고 r2를 그대로 accepted로 덮어써 한 글에 accepted 2건이
-- 생길 수 있었다. 글 행을 먼저 FOR UPDATE로 잠가 같은 글에 대한 동시 accept 호출을
-- 직렬화하고, accept UPDATE 자체도 status='pending' 조건 + rowcount 확인으로
-- 이중 방어한다(우리 예약 동시성 처리와 같은 기준).
create or replace function public.accept_sports_mate_request(p_request_id uuid) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
	v_post_id uuid;
	v_author_id uuid;
	v_request_status text;
begin
	select post_id into v_post_id from public.sports_mate_requests where id = p_request_id;
	if v_post_id is null then
		raise exception '신청을 찾을 수 없습니다.';
	end if;

	-- 같은 글에 대한 동시 수락 직렬화 — 두 번째 호출은 첫 호출의 커밋을 기다린다
	select author_id into v_author_id from public.sports_mate_posts where id = v_post_id for update;
	if v_author_id is distinct from auth.uid() then
		raise exception '이 모집글의 작성자만 수락할 수 있습니다.';
	end if;

	select status into v_request_status from public.sports_mate_requests where id = p_request_id;
	if v_request_status <> 'pending' then
		raise exception '이미 처리된 신청입니다.';
	end if;

	update public.sports_mate_requests set status = 'accepted'
		where id = p_request_id and status = 'pending';
	if not found then
		raise exception '이미 처리된 신청입니다.';
	end if;

	update public.sports_mate_requests set status = 'declined'
		where post_id = v_post_id and id <> p_request_id and status = 'pending';
	update public.sports_mate_posts set status = 'matched' where id = v_post_id;
end;
$$;

-- ② cancelled 신청의 post_id 변조 (P2): 셀프 취소 정책의 with check가
-- [requester 본인 + status='cancelled']만 검사해서, 취소하면서 post_id를 남의 글로
-- 바꾸면 is_sports_mate_requester가 그 글에 true를 반환해 비공개(matched/closed) 글
-- 조회 권한을 우회 취득할 수 있었다. booking_status_transition_guard와 같은 패턴으로
-- post_id·requester_id를 생성 후 불변으로 강제한다.
create function public.enforce_sports_mate_request_immutable_refs() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if auth.uid() is null or public.is_admin() then
		return new;
	end if;

	if new.post_id <> old.post_id or new.requester_id <> old.requester_id then
		raise exception '신청 정보는 변경할 수 없습니다.';
	end if;

	return new;
end;
$$;

create trigger sports_mate_requests_enforce_immutable_refs
	before update on public.sports_mate_requests
	for each row execute function public.enforce_sports_mate_request_immutable_refs();
