-- supabase/migrations/20260820140000_account_deletion.sql
-- 회원 탈퇴(소프트 삭제). 물리 삭제는 하지 않는다:
--   * chat_messages는 청소년보호법 안전조치(대화 저장·삭제 불가) 대상이라 보존 의무가 있고,
--   * bookings→profiles FK가 (의도적으로) cascade가 아니라 예약 이력이 있으면 행 삭제가 불가능하다.
-- 대신 개인정보(이름·전화·파트너 닉네임·소개·사진)를 익명화하고 deleted_at을 찍는다.
-- 로그인 차단은 DB가 아니라 API 라우트(/api/account/delete)에서 admin 클라이언트의
-- ban으로 처리한다 — auth.users 조작은 RPC 권한 밖.

alter table public.profiles
	add column deleted_at timestamptz;

create function public.delete_my_account() returns void
language plpgsql security definer
set search_path = public
as $$
declare
	uid uuid := auth.uid();
begin
	if uid is null then
		raise exception '로그인이 필요합니다.';
	end if;

	-- 라우트 재시도(익명화 성공 후 ban 실패) 대비 멱등 처리
	if exists (select 1 from public.profiles where id = uid and deleted_at is not null) then
		return;
	end if;

	if exists (
		select 1 from public.bookings
		where (customer_id = uid or partner_id = uid)
			and status in ('requested', 'accepted')
			and ends_at >= now()
	) then
		raise exception '진행 중인 예약이 있어 탈퇴할 수 없어요. 예약을 취소하거나 완료한 뒤 다시 시도해주세요.';
	end if;

	update public.profiles
	set name = '탈퇴한 사용자', phone = null, deleted_at = now()
	where id = uid;

	-- 빈 배열은 array_length가 null이라 photo_count 제약(between 3 and 9)에 걸리지 않는다
	update public.partner_profiles
	set is_active = false, nickname = '탈퇴한 파트너', bio = '', photo_urls = '{}'
	where profile_id = uid;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
