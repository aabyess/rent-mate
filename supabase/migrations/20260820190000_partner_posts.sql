-- supabase/migrations/20260820190000_partner_posts.sql
-- 파트너 일기(오늘의 사진 + 짧은 글) — 렌탈카노조 업계의 캐스트 다이어리 패턴.
-- 파트너가 고객을 탐색·접근하는 대신, 자기 프로필 상세에 노출되는 콘텐츠로 어필한다.
-- 공개 지면이므로 금칙어는 저장 거부(contains_banned_phrase), 게시물 단위 신고는
-- 기존 reports(reasonContext 태깅)를 쓴다. 도배 방지로 하루 5개 제한.

create table public.partner_posts (
	id uuid primary key default gen_random_uuid(),
	partner_id uuid not null references public.partner_profiles (profile_id) on delete cascade,
	content text not null check (length(content) between 1 and 500),
	photo_url text,
	created_at timestamptz not null default now()
);

create index partner_posts_partner_created_idx
	on public.partner_posts (partner_id, created_at desc);

alter table public.partner_posts enable row level security;

-- 승인·활성 파트너의 글은 로그인 사용자 모두 조회, 본인·admin은 항상
create policy "partner_posts_select" on public.partner_posts
	for select using (
		(
			auth.uid() is not null
			and exists (
				select 1 from public.partner_profiles pp
				where pp.profile_id = partner_posts.partner_id
					and pp.is_approved
					and pp.is_active
			)
		)
		or partner_id = auth.uid()
		or public.is_admin()
	);

create policy "partner_posts_insert_own" on public.partner_posts
	for insert with check (partner_id = auth.uid());

-- 일기는 대화 저장 의무 대상이 아니므로 본인 삭제 허용 (신고 내역은 reports에 남는다)
create policy "partner_posts_delete_own_or_admin" on public.partner_posts
	for delete using (partner_id = auth.uid() or public.is_admin());

create function public.enforce_partner_post_rules() returns trigger
language plpgsql
set search_path = public
as $$
begin
	if public.contains_banned_phrase(new.content) then
		raise exception '사용할 수 없는 표현이 포함되어 있어요.';
	end if;
	if (
		select count(*) from public.partner_posts
		where partner_id = new.partner_id
			and created_at >= date_trunc('day', now())
	) >= 5 then
		raise exception '일기는 하루 5개까지 올릴 수 있어요.';
	end if;
	return new;
end;
$$;

create trigger partner_posts_enforce_rules
	before insert on public.partner_posts
	for each row execute function public.enforce_partner_post_rules();
