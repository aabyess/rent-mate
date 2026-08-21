-- supabase/migrations/20260821150000_partner_likers.sql
-- 파트너가 자기 프로필에 좋아요를 누른 고객 목록(이름·시각)을 볼 수 있게 한다.
-- (사용자 확정: 기존 '개수만 공개' 원칙에서 변경. 노출은 이름·시각으로 최소화 —
-- 파트너가 고객에게 먼저 접근할 수단은 없으며, 행 접근은 함수로만 연다.)

create function public.get_partner_likers()
returns table (liker_name text, liked_at timestamptz)
language sql stable security definer
set search_path = public
as $$
	select p.name, pl.created_at
	from public.partner_likes pl
	join public.profiles p on p.id = pl.customer_id
	where pl.partner_id = auth.uid()
	order by pl.created_at desc;
$$;

revoke execute on function public.get_partner_likers() from public, anon;
grant execute on function public.get_partner_likers() to authenticated;
